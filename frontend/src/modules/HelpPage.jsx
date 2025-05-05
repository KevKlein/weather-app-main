import { FaDiceD20 } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { WiDayRainWind } from "react-icons/wi";

function HelpPage(){

    return (
        <>
        <section className="helpSection">
            <article>                  
                {/* <i FiSun /> <i FaDiceD20 /> <i WiDayRainWind /> */}
                <h2>Help</h2>
                <p>
                    <dl>
                        <dd>To get a weather forecast, choose a location.</dd>
                        <dd>Input your desired latitude and longitude coordinates, then hit the 'Enter Coordinates' button. Works for anywhere in the world. You'll need to know your desired coordinates.</dd>
                        <dd>Alternatively, enter your location automatically with the 'Geolocate' button. Only works for your present location.</dd>
                        <dd>Use the 'Previous Location' button to go back to the previous forecast location. This can be used to compare two locations.</dd>
                    </dl>
                </p>
                
            </article>
        </section>
        </>
    )
}

export default HelpPage;