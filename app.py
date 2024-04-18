# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
import pymongo
from flask import Flask, request, jsonify
from flask_cors import cross_origin, CORS
from pymongo.server_api import ServerApi
import random_msg

# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
client = pymongo.MongoClient('mongodb+srv://rritam94:0Vh6rbEKySyTh4zQ@anarchypractice.tpexkyj.mongodb.net/?retryWrites=true&w=majority&appName=AnarchyPractice', 27017)
db = client['anarchyUserData']
table = db['userData']

app = Flask(__name__, static_folder='chat_ui/build/static')
CORS(app, resources={r"/*": {"origins": "*"}})

# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/generate_response', methods=['GET'])
@cross_origin()
def generate_response():
    return jsonify({
        'message': random_msg.get_random_message()
    })

# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin()
def signup():
    data = request.json

    email = data.get('email')
    password = data.get('password')
    print(email)

    query = {'email': email}
    email_check = table.find_one(query)

    if not email_check:
        dict = {"email": email, "password":password}
        table.insert_one(dict)

        response = {'message': 'Signup successful'}
        return jsonify(response), 200

    else:
        response = {'error': 'E-MAIL ALREADY IN DATABASE'}
        return jsonify(response), 400

# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/external_login', methods=['POST', 'OPTIONS'])
@cross_origin()
def external_login():
    data = request.json

    email = data.get('email')
    print(email)

    query = {'email': email}
    email_check = table.find_one(query)

    if email_check:
        response = {'message': 'Login successful'}
        return jsonify(response), 200

    else:
        response = {'error': 'E-MAIL NOT IN DATABASE'}
        return jsonify(response), 400
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/external_signup', methods=['POST', 'OPTIONS'])
@cross_origin()
def external_signup():
    data = request.json

    email = data.get('email')
    print(email)

    query = {'email': email}
    email_check = table.find_one(query)

    if not email_check:
        dict = {"email": email}
        table.insert_one(dict)

        response = {'message': 'Signup successful'}
        return jsonify(response), 200

    else:
        response = {'error': 'E-MAIL ALREADY IN DATABASE'}
        return jsonify(response), 400
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    data = request.json

    email = data.get('email')
    password = data.get('password')

    query = {'email': email}
    email_check = table.find_one(query)

    try:
        if email_check and email_check['password'] == password:
            response = {'message': 'Login successful'}
            return jsonify(response), 200

        else:
            response = {'error': 'Incorrect Password'}
            return jsonify(response), 400
        
    except:
        response = {'error': 'Login with Google/Microsoft'}
        return jsonify(response), 400
    
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/store_msgs', methods=['POST', 'OPTIONS'])
@cross_origin()
def store_msgs():
    data = request.json

    email = data.get('email')
    messages = data.get('messages')
    uiud = data.get('uiud')

    query = {'email': email}
    email_check = table.find_one(query)

    if not email_check:
        response = {'error': 'EMAIL NOT FOUND'}
        return jsonify(response), 400

    uiud_exists = table.count_documents({'email': email, 'messages.message.uiud': uiud}, limit=1)

    if uiud_exists:
        update_query = {
            '$set': {
                'messages.$.message.msg_chain': messages
            }
        }
        table.update_one({'email': email, 'messages.message.uiud': uiud}, update_query)

    else:
        update_query = {
            '$push': {
                'messages': {
                    'message': {
                        'uiud': uiud,
                        'msg_chain': messages
                    }
                }
            }
        }
        table.update_one({'email': email}, update_query)

    response = {'message': 'Messages stored successfully'}
    return jsonify(response), 200
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/get_past_messages', methods=['GET'])
@cross_origin()
def get_past_messages():
    email = request.args.get('email') 
    user = table.find_one({'email': email})

    if user:
        uuids = [message['message']['uiud'] for message in user['messages']]
        return jsonify({'uuids': uuids}), 200
    else:
        return jsonify({'error': 'User not found'}), 404    
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #
@app.route('/get_uiud_messages', methods=['GET', 'POST'])
@cross_origin()
def get_uiud_messages():
    data = request.json

    uiud = data.get('uuid') 
    print(uiud)
    uiud_check = table.find_one({'messages.message.uiud': uiud})

    if uiud_check:
        for message in uiud_check['messages']:
            if message['message']['uiud'] == uiud:
                return jsonify({'msg_chain': message['message']['msg_chain']}), 200
    
    else:
        return jsonify({'error': 'UIUD not found'}), 404    
    
# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/delete_chat', methods=['POST'])
@cross_origin()
def delete_chat():
    data = request.json

    uuid = data.get('uuid')

    result = table.update_one(
        {'messages.message.uiud': uuid},
        {'$pull': {'messages': {'message.uiud': uuid}}}
    )

    if result:
        response = {'message': 'Chat deleted successfully'}
        return jsonify(response), 200
    else:
        response = {'error': 'Chat not found or could not be deleted'}
        return jsonify(response), 404

# -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- #

@app.route('/share_chat', methods=['POST'])
@cross_origin()
def share_chat():
    data = request.json

    uuid = data.get('uuid')

    result = table.update_one(
        {'messages.message.uiud': uuid},
        {'$set': {'messages.$.message.shared': True}}
    )

    if result:
        response = {'message': 'Chat shared successfully'}
        return jsonify(response), 200
    else:
        response = {'error': 'Chat not found or could not be deleted'}
        return jsonify(response), 404
    
@app.route('/uuid_stuff', methods=['POST'])
@cross_origin()
def handle_share_chat():
    data = request.json
    uuid = data.get('uuid')
    
    if uuid:
        uiud_check = table.find_one({
            'messages': {
                '$elemMatch': {
                    'message.uiud': uuid,
                    'message.shared': True
                }
            }
        })

        if uiud_check:
            response = {'message': 'UUID is shared'}
            return jsonify(response), 200
        else:
            response = {'error': 'UUID not found or not shared'}
            return jsonify(response), 404

    else:
        response = {'error': 'UUID not provided'}
        return jsonify(response), 400


    
if __name__ == '__main__':
    app.run(debug=True) 