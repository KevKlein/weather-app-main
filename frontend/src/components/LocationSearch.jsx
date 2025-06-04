import { useState } from "react";
import { fetchGeocoding } from "../utils/FetchGeocoding";
import Modal from "./Modal";
import "./LocationSearch.css"

/**
   * Citation:
   * Date: 2025.6.1
   * Based on open-meteo's search popup design
   * https://open-meteo.com/en/docs
   */
function LocationSearch({setShowLocationSearch, setInputCoords, fetchAndConvertWeather}) {
    const [ locationResults, setLocationResults ] = useState([]);
    const [ inputLocation, setInputLocation] = useState({
            city: "",
            state: "",
            country: ""
    });

    function closeModal() {
        setShowLocationSearch(false);
    }

    /* Update city, state, country field on user input */
    function handleFieldChange(e, field) {
        const newValue = e.target.value;
        setInputLocation({
            ...inputLocation,
            [field]: newValue
        })    
    }

    /* Get geocoding results for the modal on user hitting submit button*/
    async function handleCitySearchSubmit() {
        const { city, state, country } = inputLocation;
        const numResultsSought = 5;
        const geocodingResult = await fetchGeocoding(city, state, country, numResultsSought)
        console.log('geocoding results:', geocodingResult.locationData);
        if (geocodingResult && geocodingResult.locationData) {
            // locationData [{ name: '...', state: '…', country: '…', lat: …, lon: … }, ...]
            // rename “name” to “city” in each result
            const renamed = geocodingResult.locationData.map(item => ({
                city: item.name,
                state: item.state,
                country: item.country,
                lat: item.lat,
                lon: item.lon
            }));
            setLocationResults(renamed);
        } else {
            setLocationResults([]);
        }
    };

    /* When user picks a location, get its forecast and close the modal */ 
    function handleLocationChoice(locationEntry) {
        const { city, state, country, lat, lon } = locationEntry;
        fetchAndConvertWeather(lat, lon, locationEntry);
        setInputCoords({ lat, lon });
        closeModal();
    }


    return (
        <Modal title="Search Locations" onClose={closeModal}>
            <div className="search-by-city">
                <div className="field-wrapper">
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        type="text"
                        size={12}
                        title="Enter a city"
                        value={inputLocation.city}
                        onChange={(e) => handleFieldChange(e, "city")}
                    />
                </div>
                <div className="field-wrapper">
                    <label htmlFor="state">State</label>
                    <input
                        id="state"
                        type="text"
                        size={12}
                        title="Enter a state"
                        value={inputLocation.state}
                        onChange={(e) => handleFieldChange(e, "state")}
                    />
                </div>
                <div className="field-wrapper">
                    <label htmlFor="country">Country</label>
                    <input
                        id="country"
                        type="text"
                        size={12}
                        title="Enter a country"
                        value={inputLocation.country}
                        onChange={(e) => handleFieldChange(e, "country")}
                    />
                </div>
                <button className="search-submit-button" onClick={handleCitySearchSubmit}>
                    Search
                </button>
            </div>

            {locationResults.length > 0 && (
                <section className="search-results">
                {locationResults.map((entry, index) => {
                    const { city, state, country, lat, lon } = entry;
                    return (
                    <div
                        key={index}
                        className="search-result-entry"
                        onClick={() => handleLocationChoice(entry)}
                    >
                        <h4>{city}</h4>
                        <p>
                            {state}, {country} ({Number(lat).toFixed(2)},{" "}{Number(lon).toFixed(2)})
                        </p>
                    </div>
                    );
                })}
                </section>
            )}
        </Modal>
    );
}
export default LocationSearch;