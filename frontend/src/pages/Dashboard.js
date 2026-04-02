import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { weatherService } from '../services/api';

export default function Dashboard() {
    const [City, setCity] = useState({ city: "" });
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const navigate = useNavigate();

    const OnChange = (event) => {
        setCity({ ...City, [event.target.name]: event.target.value });
    };

    const searchHandler = async () => {
        if (!City.city) return;
        setSearchLoading(true);
        try {
            const data = await weatherService.getWeatherByCity(City.city, localStorage.getItem("uuidToken"));
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        } finally {
            setSearchLoading(false);
        }
    };

    const fetchWeatherData = async () => {
        try {
            const data = await weatherService.getWeather(localStorage.getItem("uuidToken"));
            setWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("uuidToken");
        localStorage.removeItem("userEmail");
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-md shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center space-x-4 sm:space-x-8">
                            <Link to="/dashboard" className="text-white hover:text-blue-200 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</Link>
                            <span className="text-white font-bold text-lg sm:text-xl">Weather App</span>
                        </div>
                        <button 
                            onClick={logoutHandler}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="bg-white/20 backdrop-blur-md rounded-xl sm:2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input 
                            type="text" 
                            placeholder="Search city..." 
                            name="city" 
                            value={City.city} 
                            onChange={OnChange}
                            onKeyPress={(e) => e.key === 'Enter' && searchHandler()}
                            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-xl border-2 border-transparent focus:border-blue-300 focus:ring-0 outline-none text-gray-700 placeholder-gray-400 shadow-inner text-sm sm:text-base"
                        />
                        <button 
                            onClick={searchHandler}
                            disabled={searchLoading || !City.city}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
                        >
                            {searchLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Weather Card */}
            <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-8 sm:pb-12">
                {loading ? (
                    <div className="flex justify-center items-center h-48 sm:h-64">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-white border-t-transparent"></div>
                    </div>
                ) : weatherData ? (
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-5 sm:p-8 md:p-12 transform transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                                {weatherData.location.name}, {weatherData.location.country}
                            </h2>
                            <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
                                {new Date(weatherData.location.localtime).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                            
                            <div className="flex flex-col items-center mb-6 sm:mb-8">
                                <img 
                                    src={weatherData.current.condition.icon} 
                                    alt={weatherData.current.condition.text}
                                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 drop-shadow-lg"
                                />
                                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mt-3 sm:mt-4">
                                    {weatherData.current.condition.text}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:2xl p-4 sm:p-6 text-center">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">Temperature</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{weatherData.current.temp_c}°C</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:2xl p-4 sm:p-6 text-center">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">Humidity</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{weatherData.current.humidity}%</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl sm:2xl p-4 sm:p-6 text-center">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">Wind Speed</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{weatherData.current.wind_kph} km/h</p>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:2xl p-4 sm:p-6 text-center">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-1">Visibility</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{weatherData.current.vis_km} km</p>
                                </div>
                            </div>

                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                                <div className="flex flex-wrap justify-center items-center gap-2 sm:space-x-2 text-sm sm:text-base">
                                    <span className="text-gray-500">Feels like:</span>
                                    <span className="text-lg sm:text-xl font-semibold text-gray-700">{weatherData.current.feelslike_c}°C</span>
                                    <span className="text-gray-400 mx-2 sm:mx-4">|</span>
                                    <span className="text-gray-500">UV Index:</span>
                                    <span className="text-lg sm:text-xl font-semibold text-gray-700">{weatherData.current.uv}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
                        <div className="text-5xl sm:text-6xl mb-4">🌤️</div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Weather Data Available</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Please search for a city or check your connection</p>
                    </div>
                )}
            </div>
        </div>
    );
}
