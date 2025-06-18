import React from "react";
import { updateUnits as apiUpdateUnits } from "../utils/UserPreferences";
import "./Slider.css"

function Slider({data, setData, userInfo, setUserInfo, convertUnits, unitKey, label1, label2}) {
    const { units: currentUnits, weather: weatherData } = data.current;
    const { username } = userInfo

    async function toggleSlider() {
        const newUnits = {
            ...data.desiredUnits,
            [unitKey]: data.desiredUnits[unitKey] === label1 ? label2 : label1
        };
        console.log(`current: `, data.current.units);
        console.log(`current: `, currentUnits);
        console.log(`slider newunits:`, newUnits);

        // convert weather data
        const convertedData = await convertUnits(currentUnits, newUnits, weatherData);
        setData(d => ({
            ...d,
            desiredUnits: newUnits,
            current: { 
                ...d.current,
                weather: convertedData ?? [],
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