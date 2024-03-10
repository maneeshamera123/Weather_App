import React from 'react';
import './Home.css'
import Navbar from '../Components/Navbar';

export default function Home() {
  return (
    <>
      <div><Navbar /></div>
      <div>
        <h1 className='heading'>Welcome to Weather app</h1>
        <h2 className='heading'>Know about the Weather of your city</h2>
      </div>
      <div className="container">
        <div className="city-card">
          <h2>Bangalore, India</h2>
          <img src="https://cdn3.vectorstock.com/i/1000x1000/66/42/partly-cloudy-color-icon-vector-28886642.jpg" alt="Partly Cloudy" />
          <p>Partly Cloudy</p>
          <p>Temp: 22°C</p>
          <p>Humidity: 59%</p>
        </div>
      </div>
    </>
  );
}
