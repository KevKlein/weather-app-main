import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationCrosshairs } from "react-icons/fa6";
import WeatherChart from '../components/WeatherChart';
import { useState } from "react";


function WeatherPage(){
    // current values for weather data and coords
    const [weatherData, setWeatherData] = useState([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    // most recently entered coords
    const [currentLat, setCurrentLat] = useState('');
    const [currentLon, setCurrentLon] = useState('');
    // previous weather data and coords
    const [prevWeatherData, setPrevWeatherData] = useState([]);
    const [prevLat, setPrevLat] = useState('');
    const [prevLon, setPrevLon] = useState('');

    const metrics = 
        `temperature_2m,apparent_temperature,`
        + `precipitation,precipitation_probability,`
        + `cloud_cover,relative_humidity_2m,wind_speed_10m`;



    // Fetch weather data via api url to open-meteo, using current lat & lon. 
    // Data is in JSON format.
    async function fetchWeatherData(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${metrics}&timezone=America%2FLos_Angeles&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Couldn't fetch weather data from online source ${url}`);
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

    // Enter Coordinates button
    function handleEnterCoordsButton(lat, lon) {
        enterWeatherData(lat, lon);
        saveCoords(lat, lon);
    }

    // Fetch and parse new weather data for given lat & lon, save old data
    async function enterWeatherData(lat, lon) {
        const rawData = await fetchWeatherData(lat, lon);
        if (!rawData) return;
        const data = parseWeatherData(rawData);
        setPrevWeatherData(weatherData);
        setWeatherData(data);
    }

    // store current values for weather data, latitude, longitude (for use by prev button)
    // set current values based on given data, lat, lon
    function saveCoords(lat, lon) {
        setPrevLat(currentLat);
        setPrevLon(currentLon);
        setCurrentLat(lat);
        setCurrentLon(lon);
    }

    // browser geolocation
    // https://www.w3schools.com/html/html5_geolocation.asp
    function handleGeolocationButton() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
    }
    // success function for geolocation
    function geoSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        enterWeatherData(lat, lon); // react set functions are async so we can't wait for them first
        setLatitude(lat);
        setLongitude(lon);
        setCurrentLat(lat);
        setCurrentLon(lon);
    }  
    // error function for geolocation
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

    /* Update latitude if user types part of valid number */
    function handleCoordChange(e, axis='latitude') {
        const value = e.target.value;
        const [min, max] = (axis === 'latitude') ? [-90, 90] : [-180, 180];
        const regex = /^-?\d*\.?\d*$/;
        if (value === '' || value === '-' || value === '.' ||
            (regex.test(value) && min <= value && value <= max)) {
            if (axis === 'latitude') {
                setLatitude(value);
            } else {
                setLongitude(value);
            }
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
                                onChange={e => {handleCoordChange(e, 'latitude')}}
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
                                onChange={e => {handleCoordChange(e, 'longitude')}}
                            />
                            <label htmlFor="longitude">Longitude</label>
                        </div>
                        <div className="enterCoordinatesWrapper">
                            <button 
                                className="enterCoordinatesButton"
                                title="Use entered latitude & longitude"
                                onClick={() => handleEnterCoordsButton(latitude, longitude)}
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