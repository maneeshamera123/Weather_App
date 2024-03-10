import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'



export default function Navbar() {
    const navigate = useNavigate();
    const SignUpHandler = () => {
        navigate('/register')
    }

    const LoginHandler = () => {
        navigate('/login')
    }

    return (
        <>
            <div className="navbar">
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/">About</Link>
                    <p>Weather App</p>
                </div>
                <div className="navbar-buttons">
                    <button className='loginbutton' onClick={LoginHandler} >Login</button>
                    <button className='signupbutton' onClick={SignUpHandler}>SignUp</button>
                </div>
            </div>
        </>
    );
}
