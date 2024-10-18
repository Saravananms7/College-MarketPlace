import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform simple form validation
        if (email && password) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', {
                    email,
                    password
                });

                // Assuming the response contains user info or token
                console.log('Login successful:', response.data);

                // Store the token in local storage
                localStorage.setItem('token', response.data.token);
                
                // Redirect to the marketplace
                navigate('/marketplace');
            } catch (error) {
                setErrorMessage('Invalid email or password'); // Set error message if login fails
                console.error('Login error:', error);
            }
        } else {
            alert('Please enter valid credentials');
        }
    };

    return (
        <div className={`page-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="toggle-container">
                <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <span className="slider"></span>
                </label>
            </div>
            <div className="overlay"></div>
            <div className="login-container">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login-field">
                        <label>Password:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Login</button>
                    <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;
