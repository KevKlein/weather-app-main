import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiGpsLine } from "react-icons/ri";
import WeatherChart from './WeatherChart';

function WeatherPage(){

    return (
        <>
            <h2><TiWeatherPartlySunny />Weather Forecast</h2>
            
            <article id="location" class='location'>
                <h3>Location</h3>
                <div class="location-input">
                    <h4 class='getlocation'>Enter your location by latitude and longitude, or use geolocation API.</h4>
                    <input type="text" placeholder="Latitude" size={12}/>
                    <input type="text" placeholder="Longitude" size={12}/>
                    <button title="Geolocation"><RiGpsLine /></button>
                    <button title="Undo">↩</button>
                </div>
            </article>
            <article>
                <h3>Forecast</h3>
                <WeatherChart />
            </article>

        </>
    )
}
export default WeatherPage;