import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

export default function Login() {

    const navigate = useNavigate();
    const [Info, setInfo] = useState({ email: "", password: "" });

    const submitHandler = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/loginuser", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: Info.email, password: Info.password })
        });
        const temp = await response.json();
        // console.log(temp);
        if (temp.success) {
            localStorage.setItem("userEmail", Info.email);
            localStorage.setItem("authToken", temp.authToken);
            localStorage.setItem("uuidToken", temp.uuidToken);
            navigate("/dashboard");
        } else {
            alert("Enter valid credentials");
        }
    }

    const OnChange = (event) => {
        setInfo({ ...Info, [event.target.name]: event.target.value })
    }

    return (
        <>
            <div className="container">
                <form className="login-form" onSubmit={submitHandler}>
                    <h2>Login to see weather information</h2>
                    <div className="input-container">
                        <input type="email" placeholder="Useremail" required name="email" value={Info.email} onChange={OnChange}/>
                    </div>
                    <div className="input-container">
                        <input type="password" placeholder="Password" required name="password" value={Info.password} onChange={OnChange}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}
