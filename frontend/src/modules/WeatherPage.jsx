import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiGpsLine } from "react-icons/ri";
import { FaUndo } from "react-icons/fa";
import WeatherChart from './WeatherChart';
import { useEffect, useState } from "react";


function WeatherPage(){
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [prevWeatherData, setPrevWeatherData] = useState([]);

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
    const handleUseCoordsButton = async () => {
        const rawData = await fetchWeatherData(latitude, longitude);
        if (rawData) {
            const data = parseWeatherData(rawData);
            // (set prev weather to current weather if no prev data available)
            if (prevWeatherData != []) setPrevWeatherData(weatherData); else setPrevWeatherData(data);
            setWeatherData(data);
        }

    }

    const handleUndoButton = () => {
        const temp = weatherData;
        setWeatherData(prevWeatherData);
        setPrevWeatherData(temp);
    }

    function handleLatitudeChange(e) {
        const value = e.target.value;
        // optional minus, optional digits, optional dot, optional digits
        if (/^-?\d*\.?\d*$/.test(value) || value === '' || value === '-') {
            setLatitude(value);
        }
    }
      
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
            <h2><TiWeatherPartlySunny />Weather Forecast</h2>
            <article id="location" className='location'>
                <h3>Location</h3>
                <div className="location-input">
                    <h4 className='getlocation'>Enter your location by latitude and longitude, or use geolocation API.</h4>
                    <div className="coords-wrapper">
                        <input
                            id="latitude"
                            type="text" 
                            placeholder="e.g. 44.5646" 
                            size={12}
                            title="Latitude in decimal notation"
                            onChange={e => {handleLatitudeChange(e)}}
                        />
                        <label for="latitude">Latitude</label>
                    </div>
                    <div className="coords-wrapper">
                        <input 
                            id="longitude"
                            type="text" 
                            placeholder="e.g. -123.262" 
                            size={12}
                            title="Longitude in decimal notation"
                            onChange={e => {handleLongitudeChange(e)}}
                        />
                        <label for="longitude">Longitude</label>
                    </div>
                    <button 
                        className="useCoordinatesButton"
                        title="Use entered latitude & longitude"
                        onClick={handleUseCoordsButton}
                    >
                        Use Coordinates
                    </button>
                    {' '}
                    <button 
                        className="geolocationButton" 
                        title="Use my location"
                    >
                        <RiGpsLine />
                    </button>
                    {' '}
                    <button 
                        className="undoButton" 
                        title="Undo"
                        onClick={handleUseCoordsButton}
                    >
                        <FaUndo />
                    </button>
                </div>
            </article>
            <article>
                <h3>Forecast</h3>
                <WeatherChart data={weatherData}/> 
            </article>

        </>
    )
}
export default WeatherPage;