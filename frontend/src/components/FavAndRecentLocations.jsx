import { FaStar } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { round } from "../utils/util";
import { fetchFavorites, addFavorite, removeFavorite } from "../utils/UserPreferences";
import "./FavAndRecentLocations.css"


function FavAndRecentLocations({data, setData, setInputCoords, fetchAndConvertWeather, userInfo}) {
    const { recents, favorites } = data;

    function handleLocationChoice(locationEntry) {
        const { city, state, country, lat, lon } = locationEntry;
        console.log('fav handlelocationchoice: ', locationEntry);
        fetchAndConvertWeather(lat, lon, { city, state, country });
        setInputCoords({ lat: round(lat, 2), lon: round(lon, 2) });
    }

    function handleAddFavorite(username, locationEntry) {
        // addFavorite(username, locationEntry);  // save to user's favorites via microservice
        // const newFavorites = fetchFavorites(username);  //should we update favorites like this? 
        const newFavorites = [locationEntry, ...favorites];        
        setData(d => ({
            ...d,
            favorites: newFavorites,
        }));
        handleRemoveRecent(locationEntry);
    }

    function handleRemoveRecent(locationEntry) {
        const { lat, lon } = locationEntry;
        const filtered = recents.filter( loc => !(loc.lat === lat && loc.lon === lon));
        setData( d => ({
            ...d,
            recents: filtered
        }));
    }


    return (
       <>
            <div className="fav-and-recents-container">
                { favorites && favorites[0] && (
                    <div className="favorites-container">
                        <h4>Recent Locations</h4>
                        <div className="favorites-entries">
                            {favorites.map((entry, index) => {
                                const { city, state, country, lat, lon, isCity } = entry;
                                return (
                                <div 
                                    key={index} 
                                    className="favorite-result-entry" 
                                    onClick={() => handleLocationChoice(entry)}
                                >
                                    <div>
                                        <h4>{city}</h4>
                                        {isCity 
                                            ? (<p>{state}, {country} ({Number(lat).toFixed(2)}, {Number(lon).toFixed(2)})</p>)
                                            : <p></p>
                                        }
                                    </div>
                                    <div className="favorite-buttons-container">
                                        <LuTrash2 onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(entry);
                                        }}  
                                        />
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                { recents && recents[0] && (
                    <div className="recents-container">
                        <h4>Recent Locations</h4>
                        <div className="recents-entries">
                            {recents.map((entry, index) => {
                                const { city, state, country, lat, lon, isCity } = entry;
                                return (
                                <div 
                                    key={index} 
                                    className="recent-result-entry" 
                                    onClick={() => handleLocationChoice(entry)}
                                >
                                    <div>
                                        <h4>{city}</h4>
                                        {isCity 
                                            ? (<p>{state}, {country} ({Number(lat).toFixed(2)}, {Number(lon).toFixed(2)})</p>)
                                            : <p></p>
                                        }
                                    </div>
                                    <div className="recent-buttons-container">
                                        <FaStar   onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddFavorite(entry);
                                            }}
                                        />
                                        <LuTrash2 onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveRecent(entry);
                                            }}  
                                        />
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
       </>
    );
}
export default FavAndRecentLocations;