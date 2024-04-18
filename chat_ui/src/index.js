import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './SignupComponent';
import SignupPassword from './SignupPasswordComponent';
import LoginComponent from './LoginComponent';
import LoginPasswordComponent from './LoginPasswordComponent';
import LoggedInApp from './LoggedInApp';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="40134130088-04r6oonj3l10tvsu9934mh3kvbsu1nmd.apps.googleusercontent.com">
    <Router>
      <React.StrictMode>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route path="SignupComponent" element={<Signup />} />
          <Route path="SignupPasswordComponent" element={<SignupPassword />} />
          <Route path="LoginComponent" element={<LoginComponent />} />
          <Route path="LoginPasswordComponent" element={<LoginPasswordComponent />} />
          <Route path="LoggedInAppComponent" element={<LoggedInApp />} />
        </Routes>
      </React.StrictMode>
    </Router>
  </GoogleOAuthProvider>
);

reportWebVitals();
