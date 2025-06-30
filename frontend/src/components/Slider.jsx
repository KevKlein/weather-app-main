import React from "react";
import { updateUnits as apiUpdateUnits } from "../utils/UserPreferences";
import "./Slider.css"

function Slider({data, setData, userInfo, setUserInfo, convertUnits, unitKey, label1, label2}) {
    const { units: currentUnits, dataPoints: weatherData } = data.weather;
    const { username } = userInfo

    async function toggleSlider() {
        const newUnits = {
            ...data.desiredUnits,
            [unitKey]: data.desiredUnits[unitKey] === label1 ? label2 : label1
        };
        console.log(`slider current: `, currentUnits);
        console.log(`slider newunits: `, newUnits);
        console.log('weatherdata before converting via slider :\n', JSON.stringify(weatherData[0]))
        // convert weather data
        const convertedData = await convertUnits(currentUnits, newUnits, weatherData);
        console.log('weatherdata after converting:\n', JSON.stringify(convertedData[0]))
        setData(d => ({
            ...d,
            desiredUnits: newUnits,
            weather: { 
                ...d.weather,
                dataPoints: convertedData ?? [],
                units: convertedData ? newUnits : currentUnits
            },
        }));

        // 
        if (username) {
            try {
                const updated = await apiUpdateUnits(username, newUnits);
                if (updated) {
                    setData(d => ({
                        ...d,
                        desiredUnits: updated,
                    }));
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

    const label1Active = data.desiredUnits[unitKey] === label1;

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