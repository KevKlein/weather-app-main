import { useState } from "react";
import { FaX } from "react-icons/fa6";
import "./LocationSearch.css"


function LocationSearch( { data, setData, setShowLocationSearch }) {
  
    const [inputVals, setInputVals] = useState({
            city: "",
            state: "",
            country: ""
    });
    const locationResults = []; // either search results OR favorites and recents

    const closeModal = () => setShowLocationSearch(false);
    const stopModalClick = e => e.stopPropagation();
    const searchLocation = () => {
        // get search results by geocode api call
        // display search results
    };

    function handleFieldChange(e, field) {
        const newValue = e.target.value;
        setInputVals({
            ...inputVals,
            [field]: newValue
        })    
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
        <form>
          <div className="search-types">
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
                      value={ inputVals.city }
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
                      value={ inputVals.state }
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
                      value={ inputVals.country }
                      onChange={e => {handleFieldChange(e, 'country')}}
                  />
                </div>
                <button className="search-submit-button">Submit</button>
              </div>
              
          </div>
        </form>
      </section>
    </div>
  );
}
export default LocationSearch;