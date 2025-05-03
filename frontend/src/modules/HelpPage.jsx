import { FaDiceD20 } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { WiDayRainWind } from "react-icons/wi";

function HelpPage(){

    return (
        <>
            <article>                  
                {/* <i FiSun /> <i FaDiceD20 /> <i WiDayRainWind /> */}
                <h2>Help</h2>
                <p>
                    <dl>
                        <dd>Select a location to get its weather forecast.</dd>
                        <dd>You can automatically select your present location by clicking on the Geolocate icon. This is convenient, but only works for your present location.</dd>
                        <dd>Alternatively, you can manually enter latitude and longitude coordinates for anywhere in the world. You'll need to know your desired coordinates.</dd>
                        <dd>You can go back to the previous location with the undo button</dd>

                    </dl>
                </p>
                
            </article>
        </>
    )
}

export default HelpPage;