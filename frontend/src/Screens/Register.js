import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Register.css'

import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";



export default function Register() {


    async function requestPermission() {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            // Generating Token
            const token = await getToken(messaging, {
                vapidKey:
                    "BLjO9nwe3EySJDBLwzLYdLDxvurdRomMptHGXARrttXH9vb4V3wyvs2RuknQEJ5W8HJTJSGXhUoUiGtJVo0WHjY",
            });
            // console.log("Token Gen", token);
            // Send this token to your server (database)
            sendTokenToServer(token);
        } else if (permission === "denied") {
            alert("You denied for the notification");
        }
    }


    const [Info, setInfo] = useState({ name: "", email: "", password: "", location: "", ConfirmPassword: "" });
    const navigate = useNavigate();

    async function sendTokenToServer(token) {
        try {
            const response = await fetch('http://localhost:5000/api/save-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token , location:Info.location}),
            });
    
            if (response.ok) {
                console.log('Token sent to server successfully');
            } else {
                console.error('Failed to send token to server');
            }
        } catch (error) {
            console.error('Error sending token to server:', error);
        }
    }
    

    const submitHandler = async (e) => {

        requestPermission();

        e.preventDefault();
        if (Info.password !== Info.ConfirmPassword) {
            alert("Password doesn't match")
        }
        else {
            const response = await fetch("http://localhost:5000/api/creatuser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: Info.name, email: Info.email, password: Info.password, location: Info.location })
            });
            const temp = await response.json();
            // console.log(temp);
            if (temp.success) {
                navigate("/login");
            } else {
                alert("Enter valid credentials");
            }
        }
    }

    const OnChange = (event) => {
        setInfo({ ...Info, [event.target.name]: event.target.value })
    }

    return (
        <>
            <div className="container">
                <form className="register-form" onSubmit={submitHandler}>
                    <h2>New, Register Here</h2>
                    <div className="input-container">
                        <input type="text" placeholder="Username" required name="name" value={Info.name} onChange={OnChange} />
                    </div>
                    <div className="input-container">
                        <input type="email" placeholder="Email" required name="email" value={Info.email} onChange={OnChange} />
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Password" required name="password" value={Info.password} onChange={OnChange} />
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Confirm Password" required name="ConfirmPassword" value={Info.ConfirmPassword} onChange={OnChange} />
                    </div>
                    <div className="mb-3">
                        <input type="text" placeholder="Location" required name="location" value={Info.location} onChange={OnChange} />
                    </div>
                    <br></br>
                    <button type="submit" >Register</button>
                </form>
            </div>
        </>
    );
}
