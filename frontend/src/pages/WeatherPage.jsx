import { useEffect, useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import { fetchWeatherData } from "../utils/FetchWeatherData";
import { 
    fetchFavorites as apiFetchFavorites,
    fetchUnits as apiFetchUnits
} from '../utils/UserPreferences';
import { convertUnits } from "../utils/ConvertUnits";
import { useGeolocation as apiUseGeolocation } from "../utils/UseGeolocation";
import { round } from "../utils/util";
import WeatherChart from '../components/WeatherChart';
import SliderGroup from '../components/SliderGroup';
import LocationSearch from "../components/LocationSearch";
import FavAndRecentLocations from "../components/FavAndRecentLocations";
import "./WeatherPage.css"
import { defaultUnits, defaultMetrics } from "../constants";


function WeatherPage({ weatherData, setWeatherData, userInfo, setUserInfo }) {
    const { lat, lon, dataPoints, units } = weatherData;
    const { username } = userInfo
    const [ showLocationSearch, setShowLocationSearch ] = useState(false);
    const [ inputCoords, setInputCoords] = useState({ lat: '', lon: '' })
    const [ selectedMetrics, setSelectedMetrics ] = useState(defaultMetrics);
    const [ sliderUnits, setSliderUnits ] = useState(defaultUnits); //todo
    const [ showBufferingIcon, setShowBufferingIcon ] = useState(false);
    const [ recents, setRecents ] = useState([]);  // todo
    const [ favorites, setFavorites ] = useState([]); //todo 

    const { useGeolocation } = apiUseGeolocation(setWeatherData, fetchAndConvertWeather);


    // On page load or when a user logs in (username becomes non‐null), 
    //   populate Favorites list with their favorites from microservice
    // TODO move this to App.jsx?
    // useEffect(() => {
    //     if (!username) return;
    //     (async () => {
    //         try {
    //             const [ savedFavorites, savedUnits ] = await Promise.all([
    //                 apiFetchFavorites(username),
    //                 apiFetchUnits(username),
    //             ]);
    //             setWeatherData(d => ({
    //                 ...d,
    //                 favorites: savedFavorites,
    //                 sliderUnits: savedUnits
    //             }));
    //         } catch (err) {
    //             console.error('Error loading favorites for user', username, err);
    //         }
    //     })();
    // }, [username]);

    /**
     * Fetch, parse, and convert new weather data for given lat & lon.
     * Save the weather data.
     */
    async function fetchAndConvertWeather(lat, lon, locationEntry=null) {
        const openMeteoUnits = { temperature: '°C', precipitation: 'mm', windSpeed: 'km/h' };

        // setShowBufferingIcon(true);

        // fetch and convert weather data
        const weatherData = await fetchWeatherData(lat, lon);
        if (!weatherData) return; // add error message?
        //TODO dont replace with converted data, just have both
        const convertedDataPoints = await convertUnits(openMeteoUnits, sliderUnits, weatherData);

        // Prepare new entry for Recent Locations list
        let newEntry;
        if (locationEntry) {
            const { city, state, country } = locationEntry;
            newEntry = { 
                city, 
                state, 
                country, 
                lat, 
                lon, 
                isCity: true 
            };
        } else {
            newEntry = { 
                city: '',
                state: '', 
                country: '', 
                lat, 
                lon, 
                isCity: false 
            };
        }
        console.log('new location entry: ', newEntry);
        const filtered = recents.filter((loc) => !(loc.lat === lat && loc.lon === lon)); // dont include current entry
        const newRecents = [newEntry, ...filtered];
        console.log('entries: ', filtered)

        // Save weather data and recent location, display coords in input fields
        setWeatherData(wd => ({
            lat, 
            lon,
            dataPoints: convertedDataPoints ?? [],
            units: sliderUnits
        }));
        setInputCoords({ lat: round(lat, 2), lon: round(lon, 2) });
    };

    /* Handler function for geolocation button */
    async function handleGeolocationButton() {
        // setShowBufferingIcon(true);
        useGeolocation();
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
                                <h4 className='get-location-header'>Enter a location by coordinates, geolocation, or city.</h4>
                                <div className="location-input">
                                    <div className="coords-wrapper">
                                        <input
                                            id="latitude"
                                            type="text" 
                                            placeholder="e.g.  44.56" 
                                            size={8}
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
                                            size={8}
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
                                            <div className="horizontal">
                                                <FaLocationCrosshairs /> 
                                                <div>
                                                    Geolocate Me
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="locationSearchWrapper">
                                        <button 
                                            className="locationSearchButton" 
                                            title="Find a location by name"
                                            onClick={() => setShowLocationSearch(true)}
                                        >
                                            <div className="horizontal">
                                                <GrMapLocation />
                                                <div>City Search</div>
                                            </div>
                                            
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <aside className="fav-and-recents-aside">
                        <FavAndRecentLocations 
                            weatherData={weatherData} 
                            setWeatherData={setWeatherData}
                            favorites={favorites}
                            setFavorites={setFavorites}
                            recents={recents}
                            setRecents={setRecents}
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
                    <SliderGroup 
                        weatherData={weatherData} 
                        setWeatherData={setWeatherData}
                        sliderUnits={sliderUnits}
                        setSliderUnits={setSliderUnits}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        convertUnits={convertUnits} 
                        selectedMetrics={selectedMetrics}
                    />
                </div>
                <WeatherChart 
                    units={defaultUnits} 
                    data={weatherData.dataPoints} 
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