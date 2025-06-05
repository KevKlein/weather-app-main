import React from "react";
import { updateUnits as apiUpdateUnits } from "../utils/UserPreferences";
import "./Slider.css"

function Slider({data, setData, userInfo, setUserInfo, convertUnits, unitKey, label1, label2}) {
    const { desiredUnits } = data;
    const { username } = userInfo

    async function toggleSlider() {
        const newUnits = {
            ...data.desiredUnits,
            [unitKey]: data.desiredUnits[unitKey] === label1 ? label2 : label1
        };
        // convertUnits(units, newDesired, data.current.weather);
        console.log(`slider newunits:`, newUnits);

        setData(d => ({
            ...d,
            desiredUnits: newUnits,
        }));

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

    const isLabel1 = desiredUnits[unitKey] === label1;
    return (
       <>
            <div className={`toggle-container ${unitKey}`}>
                <span className={ isLabel1 ? `${unitKey} active-label` : unitKey}>
                    {label1}
                </span>
                <label className={`switch ${unitKey}`}>
                    <input 
                        type="checkbox" 
                        id={`${unitKey}-toggle`}
                        checked={!isLabel1}
                        onChange={() => toggleSlider()}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={ !isLabel1 ? `${unitKey} active-label` : unitKey}>
                    {label2}
                </span>
            </div>
       </>
    );
}
export default Slider;