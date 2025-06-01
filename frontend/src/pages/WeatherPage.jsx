import React, { useEffect, useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationCrosshairs } from "react-icons/fa6";
import WeatherChart from '../components/WeatherChart';
import WeatherPreferences from '../components/WeatherPreferences';
import { fetchWeatherData } from "../utils/FetchWeatherData";
import { convertUnits } from "../utils/ConvertUnits";
import { useGeolocation } from "../utils/UseGeolocation";
import LocationSearch from "../components/LocationSearch";

function WeatherPage({data, setData}) {
    const [ showLocationSearch, setShowLocationSearch ] = useState(false);
    const [ inputCoords, setInputCoords] = useState({ lat: '', lon: '' })
    const { desiredUnits, current } = data;
    const defaultUnits = {
        temperature:    '°C',
        precipitation:  'mm',
        windSpeed:      'km/h'
    };

    const { handleGeolocationButton } = useGeolocation({ setData, fetchAndConvertWeather });

    /**
     * Fetch, convert and save new weather data for given lat & lon, save coordinates.
     */ 
    function handleEnterCoordsButton({lat, lon}) {
        fetchAndConvertWeather(lat, lon);
        setData(d => ({
            ...d,
            current: {...d.current, lat, lon}
        }));
    };

    /**
     * Fetch, parse, and convert new weather data for given lat & lon.
     * Save the weather data.
     */
    async function fetchAndConvertWeather(lat, lon) {
        const weatherData = await fetchWeatherData(lat, lon);
        if (!weatherData) return;
        // console.log('weatherdata: ', parsedData);
        // console.log(`fetchAndConvertWeather:`, data.desiredUnits);
        // console.log('weatherData ', parsedData);
        // Raw weather data comes in default units.
        const convertedData = await convertUnits(defaultUnits, desiredUnits, weatherData);
        setData(d => ({
            ...d,
            current: { 
                ...d.current,
                weather: convertedData ?? [],
                units: convertedData ? desiredUnits : defaultUnits
            }            
        }));
    };

    /* Update latitude if user types part of valid number */
    function handleCoordChange(e, field='latitude') {
        const value = e.target.value;
        const [min, max] = (field === 'latitude') ? [-90, 90] : [-180, 180];
        const regex = /^-?\d*\.?\d*$/;
        if (value === '' || value === '-' || value === '.' ||
            (regex.test(value) && min <= value && value <= max)) {
            if (field === 'latitude') {
                setInputCoords(coords => ({
                    ...coords,
                    lat: value
                }));
             } else {
                setInputCoords(coords => ({
                    ...coords,
                    lon: value
                }));
            };
        }
    };

    /* Convert units any time desiredUnits changes (when the user clicks a unit slider) */
    useEffect(() => {
        if (!current.weather) return;
        const sameUnits = JSON.stringify(current.units) === JSON.stringify(desiredUnits);
        if (sameUnits) return;
          (async () => {
            try {
                const converted = await convertUnits(current.units, desiredUnits, current.weather);
                setData(d => ({
                    ...d,
                    current: { ...d.current, units: desiredUnits, weather: converted }
                }));
            } catch (err) {
                console.error(err);
            }
        })();
    }, [desiredUnits]);

    return (
        <>
            <section>
                <h2><TiWeatherPartlySunny />Weather Forecast</h2>
                <article id="location" className='location'>
                    <h3>Location</h3>
                    <div className="location-outer">
                        <h4 className='get-location-header'>Enter your location by coordinates, geolocation, or city.</h4>
                        <div className="location-input">
                            <div className="coords-wrapper">
                                <input
                                    id="latitude"
                                    type="text" 
                                    placeholder="e.g.  44.56" 
                                    size={12}
                                    title="Latitude in decimal notation"
                                    value={inputCoords.lat}
                                    onChange={e => {handleCoordChange(e, 'latitude')}}
                                />
                                <label htmlFor="latitude">Latitude</label>
                            </div>
                            <div className="coords-wrapper">
                                <input 
                                    id="longitude"
                                    type="text" 
                                    placeholder="e.g.  -123.26" 
                                    size={12}
                                    title="Longitude in decimal notation"
                                    value={inputCoords.lon}
                                    onChange={e => {handleCoordChange(e, 'longitude')}}
                                />
                                <label htmlFor="longitude">Longitude</label>
                            </div>
                            <div className="enterCoordinatesWrapper">
                                <button 
                                    className="enterCoordinatesButton"
                                    title="Use entered latitude & longitude"
                                    onClick={() => handleEnterCoordsButton(inputCoords)}
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
                            <div className="locationSearchWrapper">
                                <button 
                                    className="locationSearchButton" 
                                    title="Find a location by name"
                                    onClick={() => setShowLocationSearch(true)}
                                >
                                    City Search
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
                <article>
                    <div className="forecast-header">
                        <h3>Forecast</h3>
                        <WeatherPreferences data={data} setData={setData} convertUnits={convertUnits} />
                    </div>
                    <WeatherChart units={current.units} data={current.weather}/> 
                </article>

            </section>

            {showLocationSearch && (
                <LocationSearch 
                    setShowLocationSearch={setShowLocationSearch} 
                    setInputCoords={setInputCoords}
                    fetchAndConvertWeather={fetchAndConvertWeather}
                />
            )}       
        </>
    )
}
export default WeatherPage;