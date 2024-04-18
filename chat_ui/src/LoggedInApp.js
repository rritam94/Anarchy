import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { useNavigate } from 'react-router-dom';

const useTypingAnimation = (str) => {
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('email')){
      navigate('/')
    }
  }, [])

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
      <div className="text">{message.isNew ? typedMessage : message.text}</div>
    </div>
  );
};

function LoggedInApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [uuids, setUuids] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false); 
  const navigate = useNavigate();
  const [moreVisible, setMoreVisible] = useState(false); 
  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);

  useEffect(() => {
    const sendUUIDToBackend = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const uuid = urlParams.get('uuid');

        if (!uuid) {
          console.error('UUID not found in the URL');
          return; 
        }

        const response = await fetch('http://127.0.0.1:5000/uuid_stuff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uuid: uuid }),
        });
        
        if (response.ok) {
          handleUuidButtonClick(uuid);
          console.log('UUID sent to backend successfully');
        } 
        
        else {
          console.error('Failed to send UUID to backend');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    sendUUIDToBackend(); 
  }, []); 

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  }

  useEffect(() => {
    setUniqueIdentifier(uuidv4());
  }, []); 

  const sendMessageToBackend = async (updatedMessages) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/store_msgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'email': localStorage.getItem('email'),
          'messages': updatedMessages,
          'uiud': uniqueIdentifier,
        })
      });

      if (response.ok) {
        console.log('Stored in DB');
      }

    } catch (error) {
      console.error('Error fetching message from backend:', error);
    }
  };

  const handleMessageSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_response');
      const data = await response.json();
  
      const updatedMessages = [...messages, { sender: 'user', text: newMessage, isNew: true }, { sender: 'bot', text: data.message, isNew: true }];
  
      await sendMessageToBackend(updatedMessages);
  
      setMessages(updatedMessages);
      setNewMessage('');
  
      const chatbox = document.querySelector('.chatbox');
      chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
      console.error('Error fetching message from backend:', error);
    }
  };
  

  const fetchUuids = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_past_messages?email=${localStorage.getItem('email')}`);
      const data = await response.json();
      if (response.ok) {
        setUuids(data.uuids);
      } else {
        console.error('Error fetching UUIDs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching UUIDs:', error);
    }
  };

  const resetMessages = () => {
    setMessages([]);
    setUniqueIdentifier(uuidv4()); 
  };

  useEffect(() => {
    fetchUuids();
  }, [messages]);

  const handleUuidButtonClick = async (uuid) => {
    resetMessages();
    
    const response = await fetch('http://127.0.0.1:5000/get_uiud_messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'uuid': uuid})
    });

    const msg = await response.json();
    console.log('backend msg' + msg);
    setUniqueIdentifier(uuid);
    setMessages(msg.msg_chain);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    navigate('/');
  };

  const handleMoreButtonClick = async (index, e) => {
    e.stopPropagation();
    setMoreVisible(index === clickedButtonIndex ? !moreVisible : true);
    setClickedButtonIndex(index);
  };

  const handleDeleteChat = async (uuid) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid })
      });
  
      if (response.ok) {
        fetchUuids();
        console.log('Chat deleted successfully');
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const shareChat = async (uuid) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/share_chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuid })
      });
  
      if (response.ok) {
        const baseUrl = `${window.location.origin}/LoggedInAppComponent`;
        navigator.clipboard.writeText(`${baseUrl}?uuid=${uuid}`);
        console.log('Chat shared successfully');
      } else {
        console.error('Failed to share chat');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
    }
  };

  return (
    <div className="App">
      <div className="left-box">
        <button className='new-chat' onClick={resetMessages}>
          <img className="logo40" src={hovered ? "new_chat_btn_hover.png" : "new_chat_btn.png"} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></img>
        </button>
        <div className="past-msgs">
          {uuids.slice().reverse().map((uuid, index) => (
            <div key={uuid} className="uuid-container">
              <button className="uuid-button" onClick={() => handleUuidButtonClick(uuid)}>
                <div className='uuid-text'>
                  {uuid}
                </div>

                <button className="more" onClick={(e) => handleMoreButtonClick(index, e)}>
                  ...
                </button>
              </button>

              {moreVisible && index === clickedButtonIndex && (
                <div className="popup2">
                  <button className="share" onClick={() => shareChat(uuid)}>
                    Copy Link
                  </button>
                  <button className="delete" onClick={() => handleDeleteChat(uuid)}>
                    Delete Chat
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="profile" onClick={() => setPopupVisible(!popupVisible)}> 
          <img src="pfp.jpg" className='logo50'></img>
          <div className="name">{localStorage.getItem('email')}</div>
        </button>

        {popupVisible && ( 
          <div className="popup">
            <button className="logout" onClick={handleLogout}>
              <txt>Log out</txt>
            </button>
          </div>
        )}

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
            <div className="boxes">
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
          ChatGPT can make mistakes. Consider checking important information. 
        </div>
      </div>
    </div>
  );
}

export default LoggedInApp;
