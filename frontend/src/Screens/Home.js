import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/public-weather?city=Bangalore`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">
            Welcome to Weather App
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-blue-100 font-light px-4">
            Know about the Weather of your city
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-8 max-w-6xl mx-auto px-2">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading weather...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center w-full sm:w-72 md:w-80">
              <p className="text-red-500">Unable to load weather data</p>
            </div>
          ) : weatherData && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-transform duration-300 w-full sm:w-72 md:w-80">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">{weatherData.location.name}, {weatherData.location.country}</h2>
              <img 
                src={weatherData.current.condition.icon} 
                alt={weatherData.current.condition.text} 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 rounded-full shadow-md"
              />
              <p className="text-base md:text-lg text-gray-600 mb-2">{weatherData.current.condition.text}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-6 text-gray-700 text-sm md:text-base">
                <p className="font-medium">Temp: {weatherData.current.temp_c}°C</p>
                <p className="font-medium">Humidity: {weatherData.current.humidity}%</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-transform duration-300 w-full sm:w-72 md:w-80">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Real-time Updates</h2>
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-2">Get instant weather data</p>
            <p className="text-sm text-gray-500">Any city, anytime</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-transform duration-300 w-full sm:w-72 md:w-80">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Stay Informed</h2>
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-2">Notifications enabled</p>
            <p className="text-sm text-gray-500">Never miss an update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
