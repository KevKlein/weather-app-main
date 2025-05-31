function Slider({data, setData, convertUnits, unit, label1, label2}) {
    const { desiredUnits } = data;

    function toggleSlider() {
        const newDesired = {
            ...data.desiredUnits,
            [unit]: data.desiredUnits[unit] === label1 ? label2 : label1
        };
        // convertUnits(units, newDesired, data.current.weather);
        console.log(`slider newunits:`, newDesired);

        setData(d => ({
            ...d,
            desiredUnits: newDesired,
        }));
    }

    return (
       <>
            <div className="toggle-container">
                <span className={desiredUnits[unit] === label1 ? `${unit} active-label` : `${unit}`}>{label1}</span>
                <label className={`switch ${unit}`}>
                    <input 
                        type="checkbox" 
                        id="temp-toggle" 
                        onChange={() => toggleSlider()}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={desiredUnits[unit] === label2 ? `${unit} active-label` : `${unit}`}>{label2}</span>
            </div>
       </>
    );
}
export default Slider;