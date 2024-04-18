import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MicrosoftLogin } from "react-microsoft-login";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.setItem('tempEmail', email);
    navigate('/SignupPasswordComponent');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const googleSuccessResponse = async (response) => {
    const userEmail = jwtDecode(response.credential).email;
    
    // const userEmail = response.profileObj.email;
    localStorage.setItem('email', userEmail);

    try {
      const response = await fetch('http://127.0.0.1:5000/external_signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({'email': userEmail})
      });

      if (!response.ok) {
          alert('Email already in database');
          console.error('Error:', response.statusText);
      } 
      else{
          navigate('/LoggedInAppComponent');
      }

    } catch (error) {
        console.error('Error:', error);
    }
  };

  const microsoftSuccessResponse = async (err, data) => {
    const userEmail = (err, data).userPrincipalName;
    localStorage.setItem('email', userEmail);

    try {
      const response = await fetch('http://127.0.0.1:5000/external_signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({'email': userEmail})
      });

      if (!response.ok) {
          alert('Email already in database');
          console.error('Error:', response.statusText);
      } 
      else{
          navigate('/LoggedInAppComponent');
      }

    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <div className="Signup">
      <img src="logo.png" className="logo1" alt="Logo"></img>
      <div className="create-account">Create an account</div>
      <form onSubmit={handleSubmit}>
        <input
          required
          className="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={handleEmailChange}
        ></input>
        <button className="cont">Continue</button>
      </form>

      <div className="alr">
        Already have an account?{' '}
        <Link className="log" to="/LoginComponent">
          Login
        </Link>
      </div>

      <div className="separator">
        <div className="l1"></div>
        OR
        <div className="l2"></div>
      </div>

      <div className="google">
        <GoogleLogin
          onSuccess={googleSuccessResponse}
        />
      </div>
      
      <MicrosoftLogin className='microsoft'
        clientId='865726aa-18b7-476f-a107-7c5af4cc4904' 
        authCallback={microsoftSuccessResponse}
        withUserData={true}
      />

      <div className="tos">
        <a href="https://openai.com/policies/terms-of-use">Terms of Use</a> |{' '}
        <a href="https://openai.com/policies/privacy-policy">Privacy Policy</a>
      </div>
    </div>
  );
}

export default Signup;
