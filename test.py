import pymongo

client = pymongo.MongoClient('mongodb+srv://rritam94:0Vh6rbEKySyTh4zQ@anarchypractice.tpexkyj.mongodb.net/?retryWrites=true&w=majority&appName=AnarchyPractice', 27017)
db = client['anarchyUserData']
table = db['userData']

# result = table.update_one({'email': 'ritamrana@ufl.edu'}, {'$unset': {'messages': 1}})

for document in table.find({}):
    print(document)

# uiud_check = table.find_one({
#     'messages': {
#         '$elemMatch': {
#             'message.uiud': '8984a805-a4c7-43da-9d39-5a72c6370204',
#             'message.shared': True
#         }
#     }
# })

# if uiud_check:
#     print(True)
