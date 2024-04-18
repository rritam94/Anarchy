import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const useTypingAnimation = (str) => {
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (index < str.length) {
        setTypedText((prevTypedText) => prevTypedText + str[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }
    }, 5); 

    return () => clearTimeout(typingTimer);
  }, [str, index]);

  return typedText;
};

const Message = ({ message }) => {
  const typedMessage = useTypingAnimation(message.text);

  return (
    <div className={`message ${message.sender}`}>
      <div className="sender">
        <img className="logo3" src={message.sender === 'user' ? "pfp.jpg" : "open_ai_green.jpg"} alt="Profile" />
        <div className="uChat">{message.sender === 'user' ? 'You' : 'ChatGPT'}</div>
      </div>
      <div className="text">{typedMessage}</div>
    </div>
  );
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    console.log(localStorage);
    console.log(email);
    if (email) {
      navigate('/LoggedInAppComponent');
    }
  }, []);

  const handleMessageSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_response');
      const data = await response.json();

      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: newMessage }, { sender: 'bot', text: data.message }]);
      setNewMessage('');

      const chatbox = document.querySelector('.chatbox');
      chatbox.scrollTop = chatbox.scrollHeight;
    } 
    
    catch (error) {
      console.error('Error fetching message from backend:', error);
    }
  };

  const resetMessages = () => {
    setMessages([]);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  }

  return (
    <div className="App">
      <div className="left-box">
        <button className='new-chat' onClick={resetMessages}>
          <img className="logo40" src={hovered ? "new_chat_btn_hover.png" : "new_chat_btn.png"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></img>
        </button>
        
        <div class="txt">
          <bold>Sign up or log in</bold>
          <br></br>
          <p>Save your chat history, share chats, and personalize your experience.</p>
        </div>
        <Link to="/SignupComponent" className='signup'><bold>Sign up</bold></Link>
        <Link to="/LoginComponent" className='login'><bold>Log in</bold></Link>
      </div>

      <div className="right-box">
        <div className="top">
          {messages.length === 0 && (
            <>
              <img className="logo10" src="logo.jpg" alt="Logo" />
              <div className="help">How can I help you today?</div>
            </>
          )}
        </div>
        
        <div className="chatbox">
          <div className="messages">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
          </div>
        </div>

        {messages.length === 0 && (
          <>
            <div className = "boxes">
              <button className="box-1">
                <div className="ex">
                  Suggest fun activities
                </div>
                <br></br>
                <div className="ex">
                  <gray>to help me make friends in a new city</gray>
                </div>
              </button>

              <button className="box-2">
                <div className="ex">
                  Help me debug
                </div>
                <br></br>
                <div className="ex">
                  <gray>a linked list problem</gray>
                </div>
              </button>

              <button className="box-3">
                <div className="ex">
                  Plan a trip
                </div>
                <br></br>
                <div className="ex">
                  <gray>to see the best of New York in 3 days</gray>
                </div>
              </button>

              <button className="box-4">
                <div className="ex">
                  Comparing storytelling techniques
                </div>
                <br></br>
                <div className="ex">
                  <gray>in novels and in films</gray>
                </div>
              </button>
            </div>
          </>
        )}

        <input required
          placeholder="Message ChatGPT..."
          className="messageBox"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMessageSubmit();
            }
          }}
        />

        <div className="warning">
          ChatGPT can make mistakes. Consider checking important information. Read our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default App;
