import { useEffect, useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { fetchWeatherData } from "../utils/FetchWeatherData";
import { 
    fetchFavorites as apiFetchFavorites,
    fetchUnits as apiFetchUnits
} from '../utils/UserPreferences';
import { convertUnits } from "../utils/ConvertUnits";
import { useGeolocation } from "../utils/UseGeolocation";
import { round } from "../utils/util";
import WeatherChart from '../components/WeatherChart';
import WeatherPreferences from '../components/WeatherPreferences';
import LocationSearch from "../components/LocationSearch";
import FavAndRecentLocations from "../components/FavAndRecentLocations";
import "./WeatherPage.css"

function WeatherPage({ data, setData, userInfo, setUserInfo }) {
    const { weather, desiredUnits, recents, favorites } = data;
    const { username } = userInfo
    const [ showLocationSearch, setShowLocationSearch ] = useState(false);
    const [ inputCoords, setInputCoords] = useState({ lat: '', lon: '' })
    const [selectedMetrics, setSelectedMetrics] = useState(
        new Set(['cloudCover', 'temperature', 'precipitation',]) // the metrics visible by default
    ); 

    const { geolocate } = useGeolocation(setData, fetchAndConvertWeather);

    // On page load or when a user logs in (username becomes non‐null), 
    //   populate Favorites list with their favorites from microservice
    // TODO move this to App.jsx?
    useEffect(() => {
        if (!username) return;
        (async () => {
            try {
                const [ savedFavorites, savedUnits ] = await Promise.all([
                    apiFetchFavorites(username),
                    apiFetchUnits(username),
                ]);
                setData(d => ({
                    ...d,
                    favorites: savedFavorites,
                    desiredUnits: savedUnits
                }));
            } catch (err) {
                console.error('Error loading favorites for user', username, err);
            }
        })();
    }, [username]);

    /**
     * Fetch, parse, and convert new weather data for given lat & lon.
     * Save the weather data.
     */
    async function fetchAndConvertWeather(lat, lon, locationEntry=null) {
        const openMeteoUnits = { temperature: '°C', precipitation: 'mm', windSpeed: 'km/h' };

        setBufferingIcon();

        // fetch and convert weather data
        const weatherData = await fetchWeatherData(lat, lon);
        if (!weatherData) return;
        const convertedData = await convertUnits(openMeteoUnits, desiredUnits, weatherData);

        // Prepare new entry for Recent Locations list
        let newEntry;
        if (locationEntry) {
            const { city, state, country } = locationEntry;
            newEntry = { city, state, country, lat, lon, isCity: true };
        } else {
            newEntry = { 
                city: `lat: ${round(lat, 2)}, lon: ${round(lon, 2)}`,
                state: "", 
                country: "", 
                lat, 
                lon, 
                isCity: false 
            };
        }
        const filtered = recents.filter((loc) => !(loc.lat === lat && loc.lon === lon));
        const newRecents = [newEntry, ...filtered];

        // Save weather data and recent location, display coords in input fields
        setData(d => ({
            ...d,
            weather: { 
                ...d.weather,
                lat, 
                lon,
                dataPoints: convertedData ?? [],
                units: convertedData ? desiredUnits : openMeteoUnits
            },
            recents: newRecents,
        }));
        setInputCoords({ lat: round(lat, 2), lon: round(lon, 2) });
    };
    
    /* Replaces weather datapoints with 'loading' */
    async function setBufferingIcon() {
        setData(d => ({
            ...d,
            weather: { 
                dataPoints: 'loading'
            },
        }));
    }

    /* Handler function for geolocation button */
    async function handleGeolocationButton() {
        setBufferingIcon();
        geolocate();
    }

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


    return (
        <>
            <section>
                <h2><TiWeatherPartlySunny />Weather Forecast</h2>
                <div className="weather-top">
                    <div className="weather-top-left">
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
                                            onClick={() => fetchAndConvertWeather(inputCoords.lat, inputCoords.lon)}
                                        >
                                            Enter Coordinates
                                        </button>
                                    </div>
                                    <div className="geolocationWrapper">
                                        <button 
                                            className="geolocationButton" 
                                            title="Use my location"
                                            aria-label="Use geolocation"
                                            onClick={() => handleGeolocationButton()}
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
                    </div>
                    <aside className="fav-and-recents-aside">
                        <FavAndRecentLocations 
                            data={data} 
                            setData={setData} 
                            setInputCoords={setInputCoords} 
                            fetchAndConvertWeather={fetchAndConvertWeather}
                            userInfo={userInfo}
                        />
                    </aside>
                </div>
            </section>
            <section className="forecast-section">
                <div className="forecast-header">
                    <h3>Forecast</h3>
                    <WeatherPreferences 
                        data={data} 
                        setData={setData} 
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        convertUnits={convertUnits} 
                        selectedMetrics={selectedMetrics}
                    />
                </div>
                <WeatherChart 
                    units={weather.units} 
                    data={weather.dataPoints} 
                    selectedMetrics={selectedMetrics} 
                    setSelectedMetrics={setSelectedMetrics}
                /> 
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