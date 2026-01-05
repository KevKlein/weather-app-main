import { FaRegStar } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { LuTrash2 } from "react-icons/lu";
import { round } from "../utils/util";
import { 
    fetchFavorites as apiFetchFavorites, 
    addFavorite as apiAddFavorite, 
    removeFavorite as apiRemoveFavorite
} from "../utils/UserPreferences";
import "./FavAndRecentLocations.css"


function FavAndRecentLocations({weatherData, setWeatherData, favorites, setFavorites, recents, setRecents, setInputCoords, fetchAndConvertWeather, userInfo}) {
    const { username } = userInfo;
    console.log('weatherData: ', weatherData);

    /** When the user clicks a Recent or Favorite Location entry, 
     *  get the weather for that location again.
     */
    function handleLocationChoice(locationEntry) {
        const { city, state, country, lat, lon } = locationEntry;
        console.log('fav handlelocationchoice: ', locationEntry);
        fetchAndConvertWeather(lat, lon, { city, state, country });
        setInputCoords({ lat: round(lat, 2), lon: round(lon, 2) });
    }

    /** When the user clicks a Recent Location's star, add it to favorites microservice,
     *  update state.favorites and delete the entry from Recent Locations
     */
    async function handleAddFavorite(locationEntry) {
        if (!username) return; // must be logged in
        const { lat, lon } = locationEntry;
        const locationEntryWithNums = {
            ...locationEntry,
            lat: Number(locationEntry.lat),
            lon: Number(locationEntry.lon),
        };
        // const newFavs = await apiAddFavorite(username, locationEntryWithNums);
        // The microservice returns the updated list of favorites.
        setFavorites(f => ({
            ...f.push(locationEntry) // does push return the new list or just true etc?
        }));
        handleRemoveRecent(locationEntry);
    }
    
    /** When someone clicks a Favorite Location's trashcan, 
     *  remove it from the microservice and update state
     */
    async function handleRemoveFavorite(locationEntry) {
        if (!username) return;
        const { lat, lon } = locationEntry;
        // const newFavs = await apiRemoveFavorite(username, lat, lon);
        setFavorites(f => ({
            ...f.filter(loc => !(loc.lat === lat && loc.lon === lon))  //todo
        }));
    }


    /* When the user clicks a Recent Location's trashcan, remove it from state */
    function handleRemoveRecent(locationEntry) {
        const { lat, lon } = locationEntry;
        setRecents( r => ({
            ...r.filter(loc => !(loc.lat === lat && loc.lon === lon))
        }));
    }


    return (
        <div className="fav-and-recents-outer">
            {(
                <div className="fr-container" title= {userInfo.username ? "" : "Log in to save favorite locations"}>
                    <h3><FaRegStar />Favorite Locations</h3>
                    <div className="fr-entries">
                        {favorites.map((entry, index) => {
                            const { city, state, country, lat, lon, isCity } = entry;
                            return (
                            <div 
                                key={`fav-${index}`} 
                                className="fr-result-entry" 
                                onClick={() => handleLocationChoice(entry)}
                            >
                                {isCity 
                                    ? <div>
                                        <h4>{city}</h4>
                                        <p>
                                            {state}, {country}{" "}
                                            ({Number(lat).toFixed(2)}, {Number(lon).toFixed(2)})
                                        </p>
                                      </div>
                                    : <div>
                                        <h4>{Number(lat).toFixed(2)}, {Number(lon).toFixed(2)}</h4>
                                      </div>
                                }
                                <div className="fr-buttons-container">
                                    <LuTrash2 className="trash-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFavorite(entry);
                                        }}  
                                    />
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {(
                <div className="fr-container">
                    <h3><IoLocationOutline />Recent Locations</h3>
                    <div className="fr-entries">
                        {recents.map((entry, index) => {
                            const { city, state, country, lat, lon, isCity } = entry;
                            return (
                            <div 
                                key={index} 
                                className="fr-result-entry" 
                                onClick={() => handleLocationChoice(entry)}
                            >
                                {isCity 
                                    ? <div>
                                        <h4>{city}</h4>
                                        <p>
                                            {(state) && `${state}, `}{(country) && `${country} `}
                                            ({Number(lat).toFixed(2)}, {Number(lon).toFixed(2)})
                                        </p>
                                      </div>
                                    : <div>
                                        <h4>{Number(lat).toFixed(2)}, {Number(lon).toFixed(2)}</h4>
                                      </div>
                                }
                                <div className="fr-buttons-container">
                                    {username
                                        ? <FaRegStar className="fav-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddFavorite(entry);
                                                }}
                                          />
                                        : <div  >
                                            <FaRegStar className="fav-icon disabled"
                                                title="Log in to save favorite locations" 
                                                onClick={(e) => { e.stopPropagation(); }}
                                            />
                                          </div>
                                    }
                                    <LuTrash2 className="trash-icon"
                                        onClick={(e) => {
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
    );
}
export default FavAndRecentLocations;