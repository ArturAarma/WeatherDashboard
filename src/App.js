import React, { useContext, useState, useEffect } from "react";
import Forecast from "./components/Forecast";
import WeatherCard from "./components/WeatherCard";
import { DarkModeContext } from "./components/DarkModeContext";
import Overview from "./components/Overview";
import Header from "./components/Header";
import GetWeatherData from "./functions/GetWeatherData";

// cities to load on opening the site
const preloadedCities = ["Tallinn", "Berlin", "Paris", "Lissabon"];

function App() {

  const {darkMode, setDarkMode} = useContext(DarkModeContext);
  const [city, setCity] = useState("Berlin");
  const [weather, setWeather] = useState(null);
  const [weatherData, setWeatherData] = useState([]);


// data fetching for preloaded cities
  useEffect(() => {
    const fetchPreloadedCities = async () => {
        const results = await Promise.all(
            preloadedCities.map(async (city) => {
                const data = await GetWeatherData(city);
                return data ? {
                    city: data.name,
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    wind: data.wind.speed
                } : null;
            })
        );
        setWeatherData(results.filter(city => city !== null)); // removes fetches that didnt go through
    };

    fetchPreloadedCities();
}, []);

  const fetchWeather = async (city) => {
    if (!city) return;
  
    const data = await GetWeatherData(city);
  
    console.log("Raw API Response:", data); 
  
    if (data && data.main) {
      const formattedWeather = {
        city: data.name,
        temperature: data.main.temp, 
        humidity: data.main.humidity, 
        wind: data.wind.speed
      };
  
      console.log("Formatted Weather Object:", formattedWeather); 
      setWeather(formattedWeather);
    } else {
      console.error("Weather data is missing expected properties:", data);
      setWeather(null);
    }
  };
  
  
  

  return (
    <div className={`min-h-screen bg-gray-200  dark:bg-gray-900 `}>
      {/* Header */}
      <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} fetchWeather={fetchWeather}/>
      </div>
      {console.log("API Key:", process.env.REACT_APP_WEATHER_API_KEY)};


      {/* Main Weather Card */}
      <div className="px-6 py-6">
        <WeatherCard weather={weather} weatherData={weatherData}/>

       
        
      </div>

      {/* Overview Section */}
      <div>
        <Overview />
      </div>

      {/* Forecast Section */}
      <div >
        <Forecast/>
      </div>


    </div>
  );
}

export default App;
