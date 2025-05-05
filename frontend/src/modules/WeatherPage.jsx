import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiGpsLine } from "react-icons/ri";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaUndo } from "react-icons/fa";
import WeatherChart from './WeatherChart';
import { useEffect, useState } from "react";


function WeatherPage(){
    const [weatherData, setWeatherData] = useState([]);
    const [prevWeatherData, setPrevWeatherData] = useState([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    // most recently entered coords
    const [currentLat, setCurrentLat] = useState('');
    const [currentLon, setCurrentLon] = useState('');
    // second most recently entered coords
    const [prevLat, setPrevLat] = useState('');
    const [prevLon, setPrevLon] = useState('');


    // Fetch weather data via api url to open-meteo, using current lat & lon. Data is in JSON format.
    async function fetchWeatherData(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,cloud_cover,relative_humidity_2m,wind_speed_10m,precipitation_probability,apparent_temperature&timezone=America%2FLos_Angeles&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Couldn't fetch weather data from online source");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
        }
    }

    // Parse raw weather data
    function parseWeatherData(rawData) {
        const times = rawData.hourly.time;
        const data = times.map((time, i) => ({
            time,
            cloudCover: rawData.hourly.cloud_cover[i],
            temperature: rawData.hourly.temperature_2m[i],
            precipitation: rawData.hourly.precipitation[i],
            precipitationChance: rawData.hourly.precipitation_probability[i],
            apparentTemp: rawData.hourly.apparent_temperature[i],
            humidity: rawData.hourly.relative_humidity_2m[i],
            windSpeed: rawData.hourly.wind_speed_10m[i],
        }));
        return data;
    }

    // Fetch and parse new weather data for given lat & lon, save old data
    async function enterWeatherData(lat, lon) {
        const rawData = await fetchWeatherData(lat, lon);
        if (!rawData) return;
        const data = parseWeatherData(rawData);
        saveWeatherAndCoords(data, latitude, longitude);
    }

    // store current values for weather data, latitude, longitude (for use by prev button)
    // set current values based on given data, lat, lon
    function saveWeatherAndCoords(data, lat, lon) {
        setPrevWeatherData(weatherData);
        setWeatherData(data);
        setPrevLat(currentLat);
        setPrevLon(currentLon);
        setCurrentLat(lat);
        setCurrentLon(lon);
    }
// here we try to get rid of current 

    // browser geolocation
    // https://www.w3schools.com/html/html5_geolocation.asp
    function handleGeolocationButton() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
    }
    
    // mandatory helper function for geolocation
    function geoSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        enterWeatherData(lat, lon); // react set functions are async so we can't wait for them first
        setLatitude(lat);
        setLongitude(lon);
        setCurrentLat(lat);
        setCurrentLon(lon);
    }  

    // optional helper function for geolocation
    function geoError() {
        alert("Geolocation didn't work.");
    }

    // switch current and previous values for weather data, lat, lon
    function handlePrevButton() {
        // swap weatherData
        const tempData = weatherData;
        setWeatherData(prevWeatherData);
        setPrevWeatherData(tempData);
        // swap lat
        const tempLat = currentLat;
        setLatitude(prevLat);
        setCurrentLat(prevLat);
        setPrevLat(tempLat);
        // swap lon
        const tempLon = currentLon;
        setLongitude(prevLon);
        setCurrentLon(prevLon);
        setPrevLon(tempLon);
    }

    // update lat upon user typing something valid
    function handleLatitudeChange(e) {
        const value = e.target.value;
        // optional minus, optional digits, optional dot, optional digits
        if (/^-?\d*\.?\d*$/.test(value) || value === '' || value === '-') {
            setLatitude(value);
        }
    }
      
    // update lon upon user typing something valid
    function handleLongitudeChange(e) {
        const value = e.target.value;
        // optional minus, optional digits, optional dot, optional digits
        if (/^-?\d*\.?\d*$/.test(value) || value === '' || value === '-') {
            setLongitude(value);
        }
    }

    // main component
    return (
        <>
        <section>
            <h2><TiWeatherPartlySunny />Weather Forecast</h2>
            <article id="location" className='location'>
                <h3>Location</h3>
                <div className="location-outer">
                    <h4 className='get-location-header'>Enter your location by latitude and longitude, or use geolocation API.</h4>
                    <div className="location-input">
                        <div className="coords-wrapper">
                            <input
                                id="latitude"
                                type="text" 
                                placeholder="e.g.  44.5646" 
                                size={12}
                                title="Latitude in decimal notation"
                                value={latitude}
                                onChange={e => {handleLatitudeChange(e)}}
                            />
                            <label htmlFor="latitude">Latitude</label>
                        </div>
                        <div className="coords-wrapper">
                            <input 
                                id="longitude"
                                type="text" 
                                placeholder="e.g.  -123.262" 
                                size={12}
                                title="Longitude in decimal notation"
                                value={longitude}
                                onChange={e => {handleLongitudeChange(e)}}
                            />
                            <label htmlFor="longitude">Longitude</label>
                        </div>
                        <div className="enterCoordinatesWrapper">
                            <button 
                                className="enterCoordinatesButton"
                                title="Use entered latitude & longitude"
                                onClick={() => enterWeatherData(latitude, longitude)}
                            >
                                Enter Coordinates
                            </button>
                        </div>
                        <div className="geolocationWrapper">
                            <button 
                                className="geolocationButton" 
                                title="Use my location"
                                aria-label="Use geolocation"
                                onClick={handleGeolocationButton}
                            >
                                <FaLocationCrosshairs />
                            </button>
                        </div>
                        <div className="prevWrapper">
                            <button 
                                className="prevButton" 
                                title="Previous location"
                                onClick={handlePrevButton}
                            >
                                Previous Location
                            </button>
                        </div>
                    </div>
                </div>
            </article>
            <article>
                <h3>Forecast</h3>
                <WeatherChart data={weatherData}/> 
            </article>

        </section>
        </>
    )
}
export default WeatherPage;