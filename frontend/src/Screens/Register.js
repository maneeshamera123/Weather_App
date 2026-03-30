import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { messaging } from "../firebase";
import { getToken } from "firebase/messaging";

export default function Register() {
    async function requestPermission(userId) {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const token = await getToken(messaging, {
                    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
                });
                await sendTokenToServer(token, userId);
            } else if (permission === "denied") {
                alert("You denied notifications. You won't receive weather alerts.");
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    const [Info, setInfo] = useState({ name: "", email: "", password: "", location: "", ConfirmPassword: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function sendTokenToServer(token, userId) {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/save-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, token, location: Info.location }),
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
        e.preventDefault();
        if (Info.password !== Info.ConfirmPassword) {
            alert("Password doesn't match")
        }
        else {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/creatuser`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: Info.name, email: Info.email, password: Info.password, location: Info.location })
                });
                const temp = await response.json();
                if (temp.success) {
                    await requestPermission(temp.userId);
                    navigate("/login");
                } else {
                    alert("Enter valid credentials");
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert("Something went wrong. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const OnChange = (event) => {
        setInfo({ ...Info, [event.target.name]: event.target.value })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Join us to get weather updates</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            required 
                            name="name" 
                            value={Info.name} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                            name="email" 
                            value={Info.email} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            required 
                            name="password" 
                            value={Info.password} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="Confirm your password" 
                            required 
                            name="ConfirmPassword" 
                            value={Info.ConfirmPassword} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input 
                            type="text" 
                            placeholder="Enter your city" 
                            required 
                            name="location" 
                            value={Info.location} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-4 text-sm sm:text-base"
                    >
                        {isLoading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-gray-600 text-sm sm:text-base">
                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
