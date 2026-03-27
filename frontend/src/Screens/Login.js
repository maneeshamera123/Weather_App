import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [Info, setInfo] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/loginuser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: Info.email, password: Info.password })
            });
            const temp = await response.json();
            if (temp.success) {
                localStorage.setItem("userEmail", Info.email);
                localStorage.setItem("authToken", temp.authToken);
                localStorage.setItem("uuidToken", temp.uuidToken);
                navigate("/dashboard");
            } else {
                alert("Enter valid credentials");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const OnChange = (event) => {
        setInfo({ ...Info, [event.target.name]: event.target.value })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">Login to see weather information</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                            name="email" 
                            value={Info.email} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            required 
                            name="password" 
                            value={Info.password} 
                            onChange={OnChange}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-sm sm:text-base"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-gray-600 text-sm sm:text-base">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
