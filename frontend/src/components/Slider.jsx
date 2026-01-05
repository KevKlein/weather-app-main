import { updateUnits as apiUpdateUnits } from "../utils/UserPreferences";
import "./Slider.css"

function Slider({ unitKey, label1, label2, weatherData, setWeatherData, sliderUnits, setSliderUnits, userInfo, setUserInfo, convertUnits}) {
    const { username } = userInfo;

    async function toggleSlider() {
      const currentUnit = sliderUnits[unitKey];
      const newUnit = sliderUnits[unitKey] === label1 ? label2 : label1 // todo reverse these?
      
        const newSliderUnits = {
            ...sliderUnits,
            [unitKey]: newUnit
        };
        console.log(`slider units: `, sliderUnits);
        console.log(`slider newunits: `, newSliderUnits);

        // console.log('weatherdata before converting via slider :\n', JSON.stringify(weatherData[0]))
        // convert weather data
        const convertedDataPoints = convertUnits(currentUnit, newUnit, weatherData.dataPoints);
        // console.log('weatherdata after converting:\n', JSON.stringify(convertedData[0]))
        setWeatherData(wd => ({
            ...wd,
            dataPoints: convertedDataPoints,
            units: newSliderUnits
        }));
        setSliderUnits(newSliderUnits);

        // update user preferences for new unit
        if (username) {
            try {
                const updated = await apiUpdateUnits(username, newSliderUnits); // TODO does this really need to await?
                if (updated) {
                    setUserInfo(u => ({
                         ...u,
                        units: updated
                    }));
                }
            } catch (err) {
                console.error('Failed to save units:', err);
            }
        }
    }

    const label1Active = sliderUnits[unitKey] === label1;

    return (
       <>
            <div className={`toggle-container ${unitKey}`}>
                <span className={ label1Active ? `${unitKey} active-label` : unitKey}>
                    {label1}
                </span>
                <label className={`switch ${unitKey}`}>
                    <input 
                        type="checkbox" 
                        id={`${unitKey}-toggle`}
                        checked={!label1Active}
                        onChange={() => toggleSlider()}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={ !label1Active ? `${unitKey} active-label` : unitKey}>
                    {label2}
                </span>
            </div>
       </>
    );
}
export default Slider;