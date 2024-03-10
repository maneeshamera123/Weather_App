import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Register.css'

export default function Register() {
    const navigate = useNavigate();
    const [Info, setInfo] = useState({ name: "", email: "", password: "", location: "", ConfirmPassword:""});

    const submitHandler = async (e) => {
        e.preventDefault();
        if (Info.password !== Info.ConfirmPassword) {
            alert("Password doesn't match")
        }
        else{
            const response = await fetch("http://localhost:5000/api/creatuser", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: Info.name, email: Info.email, password: Info.password, location: Info.location})
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
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
}
