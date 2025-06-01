import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { fetchGeocoding } from "../utils/FetchGeocoding";
import "./LocationSearch.css"


function LocationSearch( { setShowLocationSearch, setInputCoords, fetchAndConvertWeather }) {
    const [ locationResults, setLocationResults ] = useState([]);
    const [ inputLocation, setInputLocation] = useState({
            city: "",
            state: "",
            country: ""
    });

    /* Don't close the modal if the user clicks inside it */
    const stopModalClick = e => e.stopPropagation();

    /* Close the modal */
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
            setLocationResults(geocodingResult.locationData);
        } else {
            setLocationResults([]);
        }
    };

    function handleLocationChoice(locationEntry) {
        const { city: name, state, country, lat, lon } = locationEntry;
        fetchAndConvertWeather(lat, lon);
        setInputCoords({ lat, lon });
        closeModal();
    }


    /**
   * Citation:
   * Date: 2025.6.1
   * Based on open-meteo's search popup design
   * https://open-meteo.com/en/docs
   */
  return (               
    <div className="modal-overlay" onClick={closeModal}>
      <section className="modal-content" onClick={stopModalClick}>
        <div className="modal-header">
            <h3>Search Locations</h3>
            <button type="button" className="modal-close-button" onClick={closeModal}>
                <FaX />
            </button>
        </div>
        <div className="search-by-city">
            <div field-wrapper>
                <label htmlFor="city">City</label>
                <input 
                    required=''
                    id="city"
                    type="text" 
                    placeholder="" 
                    size={12}
                    title="Enter a city"
                    value={ inputLocation.city }
                    onChange={e => {handleFieldChange(e, 'city')}}
                /> 
            </div>
            <div field-wrapper>
                <label htmlFor="state">State</label>
                <input 
                    id="state"
                    type="text" 
                    placeholder="" 
                    size={12}
                    title="Enter a state"
                    value={ inputLocation.state }
                    onChange={e => {handleFieldChange(e, 'state')}}
                /> 
            </div>
            <div field-wrapper>
                <label htmlFor="country">Country</label>
                <input 
                    id="country"
                    type="text" 
                    placeholder="" 
                    size={12}
                    title="Enter a country"
                    value={ inputLocation.country }
                    onChange={e => {handleFieldChange(e, 'country')}}
                />
            </div>
            <button className="search-submit-button" onClick={handleCitySearchSubmit}>Search</button>
        </div>
        { locationResults && locationResults[0] && (
            <section className="search-results">
                {locationResults.map( (entry, index) => {
                    const { name: city, state, country, lat, lon } = entry;
                    return(
                    <div key={index} className="search-result-entry" onClick={() => handleLocationChoice(entry)}>
                        <h4>{city}</h4>
                        <p>
                            {state}, {country} ({Number(lat).toFixed(2)}, {Number(lon).toFixed(2)})
                        </p>
                    </div>
                    );
                })}
            </section>
        )}

      </section>
    </div>
  );
}
export default LocationSearch;