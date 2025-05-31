import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaLocationCrosshairs } from "react-icons/fa6";
import WeatherChart from '../components/WeatherChart';
import WeatherPreferences from '../components/WeatherPreferences';
import { useEffect } from "react";

function WeatherPage({data, setData}){
    const { desiredUnits, inputVals, current } = data;
    const defaultUnits = {
        temperature:    '°C',
        precipitation:  'mm',
        windSpeed:      'km/h'
    };

    // Enter Coordinates button
    function handleEnterCoordsButton({lat, lon}) {
        enterWeatherData(lat, lon);
        saveCoords(lat, lon);
    }

    // Fetch weather data via api url to open-meteo, using current lat & lon. 
    // Data is in JSON format.
    async function fetchWeatherData(lat, lon) {
        const metrics = 
            `temperature_2m,apparent_temperature,`
            + `precipitation,precipitation_probability,`
            + `cloud_cover,relative_humidity_2m,wind_speed_10m`;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${metrics}&timezone=auto&forecast_days=1&temporal_resolution=hourly_6`;
        console.log(`url: `, url);
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

    /** Transforms units to conform to microservice expected format.
     *  Helper for convertUnits function.
     */ 
    function buildUnitsPayload(UIunits) {
        const payloadUnits = {
            temperature: UIunits.temperature,
            apparent_temperature: UIunits.temperature,
            precipitation: UIunits.precipitation,
            wind_speed_10m: UIunits.windSpeed,
            cloud_cover:             '%',
            precipitation_probability:'%',
            relative_humidity_2m:    '%',
        }
        return payloadUnits;
    }


    /* Convert units of weather data via POST to Microservice */
    async function convertUnits(oldUnits, newUnits, weatherData) {
        const url = "http://localhost:4000/api/convert-units";
        console.log(`convertUnits: old `, oldUnits);
        console.log(`convertUnits: new `, newUnits);

        const payload = {
            currentUnits: buildUnitsPayload(oldUnits),
            desiredUnits: buildUnitsPayload(newUnits),
            rawData: weatherData
        }
        
        try {
            const resp = await fetch(url, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload)
            });
            if (!resp.ok) {
                throw new Error(`Convert‐units API returned HTTP ${resp.status}`);
            }

            const body = await resp.json();
            // body === { message, conversions: { desiredUnits, convertedData } }
            const { conversions: { convertedData }} = body;
            // setData(d => ({
            //     ...d,
            //     current: {
            //         ...d.current,
            //         weather: convertedData
            //     }
            // }));
            return convertedData;
        }
        catch (err) {
            console.error("Error converting units:", err);
            return null;
        }
    }


    /**
     * Fetch and parse new weather data for given lat & lon, save old data.
     * Display the weather chart for fetched data.
     */
    async function enterWeatherData(lat, lon) {
        const rawData = await fetchWeatherData(lat, lon);
        if (!rawData) return;
        const parsedData = parseWeatherData(rawData);
        console.log('weatherdata: ', parsedData);
        console.log(`enterWeatherData:`, data.desiredUnits);

        // const convertedData = await convertUnits(defaultUnits, desiredUnits, parsedData);
        // console.log('convertedData ', convertedData);
        console.log('weatherData ', parsedData);
        setData(d => ({
            ...d,
            current: { ...d.current, weather: parsedData, units: defaultUnits}            
        }))
    }


    /* Trigger convertUnits any time desiredUnits or current.weather changes */
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
    }, [desiredUnits, current.units, current.weather]);


    // store current values for weather data, latitude, longitude (for use by prev button)
    // set current values based on given data, lat, lon
    function saveCoords(lat, lon) {
        setData(d => ({
            ...d,
            current: {...d.current, lat, lon}
        }))
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
        setData(d => ({
            ...d,
            inputVals: {lat, lon},
            current: {...d.current, lat, lon}
        }))
    }  
    // error function for geolocation
    function geoError() {
        alert("Geolocation didn't work.");
    }

    // switch current and previous values for weather data, lat, lon
    // function handlePrevButton() {
    //     setData(d => ({
    //         inputVals: {lat: prev.lat, lon: prev.lon},
    //         current: {...d.prev},
    //         prev: {...d.current}
    //     }))
    // }

    /* Update latitude if user types part of valid number */
    function handleCoordChange(e, axis='latitude') {
        const value = e.target.value;
        const [min, max] = (axis === 'latitude') ? [-90, 90] : [-180, 180];
        const regex = /^-?\d*\.?\d*$/;
        if (value === '' || value === '-' || value === '.' ||
            (regex.test(value) && min <= value && value <= max)) {
            if (axis === 'latitude') {
                setData(d => ({
                    ...d,
                    inputVals: {...d.inputVals, lat: value}
                }));
             } else {
                setData(d => ({
                    ...d,
                    inputVals: {...d.inputVals, lon: value}
                }));
            };
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
                                value={inputVals.lat}
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
                                value={inputVals.lon}
                                onChange={e => {handleCoordChange(e, 'longitude')}}
                            />
                            <label htmlFor="longitude">Longitude</label>
                        </div>
                        <div className="enterCoordinatesWrapper">
                            <button 
                                className="enterCoordinatesButton"
                                title="Use entered latitude & longitude"
                                onClick={() => handleEnterCoordsButton(inputVals)}
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
        </>
    )
}
export default WeatherPage;