import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Dashboard.css';
import '../Components/Navbar.css';


export default function Dashboard() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchweatherData = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/weather", {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem("uuidToken")
                }
            });

            if (res.ok) {
                const data = await res.json();
                setWeatherData(data);
            } else {
                throw new Error('Failed to fetch weather data');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        fetchweatherData();
    }, []);
    
  
    const LogoutHandler = () => {
        localStorage.removeItem("authToken");
        navigate('/');
    };

   
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
                <div>
                <div className="navbar">
                    <div className="navbar-links">
                        <Link to="/dashboard">Home</Link>
                        <p>Weather App</p>
                    </div>
                    <div className="navbar-buttons">
                        <button className='signupbutton' onClick={LogoutHandler}>Logout</button>
                    </div>
                </div>
            </div>
            <div className="container">
                {weatherData && (
                    <div className="city-card">
                        <h2>{weatherData.location.name}</h2>
                        <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
                        <p>{weatherData.current.condition.text}</p>
                        <p>Temp: {weatherData.current.temp_c}°C</p>
                        <p>Humidity: {weatherData.current.humidity}%</p>
                    </div>
                )}
            </div>
        </>
    );
}