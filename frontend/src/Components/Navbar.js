import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const SignUpHandler = () => {
        navigate('/register');
        setIsMenuOpen(false);
    }

    const LoginHandler = () => {
        navigate('/login');
        setIsMenuOpen(false);
    }

    return (
        <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        <Link to="/" className="text-white hover:text-blue-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</Link>
                        <Link to="/" className="text-white hover:text-blue-300 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hidden sm:block">About</Link>
                        <span className="text-blue-400 font-bold text-base sm:text-lg">Weather App</span>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center space-x-4">
                        <button 
                            onClick={LoginHandler} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                            Login
                        </button>
                        <button 
                            onClick={SignUpHandler}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-blue-300 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden pb-4">
                        <div className="flex flex-col space-y-3 pt-2">
                            <button 
                                onClick={LoginHandler} 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md text-sm w-full"
                            >
                                Login
                            </button>
                            <button 
                                onClick={SignUpHandler}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md text-sm w-full"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
