function Slider({data, setData, unit, label1, label2}) {
    const { units } = data;

    function toggleSlider() {
        setData(prev => {
            const current = prev.units[unit];
            let newValue;

            switch (unit) {
                case 'temperature':
                    newValue = current === '°C' ? '°F' : '°C';
                    break;
                case 'precipitation':
                    newValue = current === 'mm' ? 'inch' : 'mm';
                    break;
                case 'windSpeed':
                    newValue = current === 'km/h' ? 'mph' : 'km/h';
                    break;
                default:
                    newValue = current; // no change
                }
                
                return {
                ...prev,
                units: {
                    ...prev.units,
                    [unit]: newValue
                }
            };
        });
    }

    return (
       <>
            <div className="toggle-container">
                <span className={units[unit] === label1 ? `${unit} active-label` : `${unit}`}>{label1} </span>
                <label className={`switch ${unit}`}>
                    <input 
                        type="checkbox" 
                        id="temp-toggle" 
                        onClick={() => toggleSlider()}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={units[unit] === label2 ? `${unit} active-label` : `${unit}`}> {label2}</span>
            </div>
       </>
    );
}
export default Slider;