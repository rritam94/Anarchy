import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function LoginPassword() {
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

            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });


            if (!response.ok) {
                alert('Incorrect Password or Email is incorrect!');
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
            <div className="create-account2">Welcome back</div>
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
                Don't have an account?{' '}
                <Link className="log" to="/SignupComponent">
                    Sign Up
                </Link>
            </div>

            <div className="tos">
                <a href="https://openai.com/policies/terms-of-use">Terms of Use</a> |{' '}
                <a href="https://openai.com/policies/privacy-policy">Privacy Policy</a>
            </div>
        </div>
    );
}

export default LoginPassword;
