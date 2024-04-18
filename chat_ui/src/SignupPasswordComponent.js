import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SignupPassword() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); 
    };

    const nav = async (event) => {
        event.preventDefault();
        navigate('/SignupComponent');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                email: localStorage.getItem('tempEmail'),
                password: e.target.elements.password.value
            };

            console.log('Form Data: ' + formData.email);

            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                alert('Email already in database');
                console.error('Error:', response.statusText);
            } 
            else{
                localStorage.setItem('email', formData.email);
                navigate('/LoggedInAppComponent');
            }

        } catch (error) {
            console.error('Error:', error);
        }

    };

    return (
        <div className="Signup">
            <img src="logo.png" className="logo2" alt="Logo"></img>
            <div className="create-account2">Create an account</div>
            <div className="emaildiv">
                {localStorage.getItem('tempEmail')}
                <button className = "edit" onClick={nav}>Edit</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        required
                        className="email password"
                        name="password"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Password"
                    ></input>
                    {/* <button type="button" className="show-hide-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? (
                            <img className="pw" src="hide.png" alt="Hide Password" />
                        ) : (
                            <img className="pw" src="view.png" alt="View Password" />
                        )}
                    </button> */}
                    <button className="conti">Continue</button>
                </div>
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

            {/* <button className="google">
                <img className="logos" src="google.png" alt="Google Logo"></img> Continue with Google
            </button>

            <button className="microsoft">
                <img className="logos" src="microsoft.png" alt="Microsoft Logo"></img> Continue with Microsoft
                Account
            </button>

            <button className="apple">
                <img className="logos" src="apple.png" alt="Apple Logo"></img> Continue with Apple
            </button> */}

            <div className="tos">
                <a href="https://openai.com/policies/terms-of-use">Terms of Use</a> |{' '}
                <a href="https://openai.com/policies/privacy-policy">Privacy Policy</a>
            </div>
        </div>
    );
}

export default SignupPassword;
