import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import './Dashboard.css';
import '../Components/Navbar.css';

export default function Dashboard() {
    const [City, setCity] = useState({ city: "" });

    const OnChange = (event) => {
        setCity({ ...City, [event.target.name]: event.target.value });
    };

    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const searchHandler = async () => {
        try {
            if (City.city) {
                const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=dc6b7772fa134eda80660624241003&q=${City.city}`);
                const data = response.data;
                setWeatherData(data);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const fetchWeatherData = async () => {
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
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        navigate('/');
    };

    return (
        <>
            <div>
                <div className="navbar">
                    <div className="navbar-links">
                        <Link to="/dashboard">Home</Link>
                        <p>Weather App</p>
                    </div>
                    <div className="navbar-buttons">
                        <button className='signupbutton' onClick={logoutHandler}>Logout</button>
                    </div>
                </div>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search city for weather information" name="city" value={City.city} onChange={OnChange}/>
                <button type="button" onClick={searchHandler}>Search</button>
            </div>
            <div className="container">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="city-card">
                        <h2>{weatherData ? weatherData.location.name : "No Data Available"}</h2>
                        {weatherData && (
                            <>
                                <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
                                <p>{weatherData.current.condition.text}</p>
                                <p>Temp: {weatherData.current.temp_c}°C</p>
                                <p>Humidity: {weatherData.current.humidity}%</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
