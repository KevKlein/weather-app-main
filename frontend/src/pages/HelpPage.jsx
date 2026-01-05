import { FaDiceD20 } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { WiDayRainWind } from "react-icons/wi";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

function HelpPage(){

    return (
        <>
        <section className="helpSection">
            <article>                  
                {/* <i FiSun /> <i FaDiceD20 /> <i WiDayRainWind /> */}
                <h2>Help</h2>
                <p>
                    <dl>
                        <dd>To get a weather forecast, choose a location. There are three ways to choose a location:</dd>
                        <dd> * Input your desired latitude and longitude coordinates, then hit the 'Enter Coordinates' button. Works for anywhere in the world. You'll need to know your desired coordinates.</dd>
                        <dd> * Use the <FaLocationCrosshairs /> Geolocate Me button. Only works for your present location.</dd>
                        <dd> * Use the <GrMapLocation /> City Search to look up a city by name. State and country are optional.</dd>
                    </dl>
                </p>
                
            </article>
        </section>
        </>
    )
}

export default HelpPage;