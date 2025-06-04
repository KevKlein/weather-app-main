import Slider from "./Slider";

function WeatherPreferences({data, setData, convertUnits, selectedMetrics}) {

    return (
       <div className="weatherSliders">
            { data.current.weather[0] && ((selectedMetrics.has('temperature') || selectedMetrics.has('apparentTemp'))) && (
                <Slider 
                    unit='temperature' 
                    label1='°F' 
                    label2='°C' 
                    data={data} 
                    setData={setData} 
                    convertUnits={convertUnits} 
                />
            )}
            { data.current.weather[0] && selectedMetrics.has('precipitation') && (
                <Slider 
                    unit='precipitation' 
                    label1='inches' 
                    label2='mm' 
                    data={data} 
                    setData={setData} 
                    convertUnits={convertUnits} 
                />
            )}
            { data.current.weather[0] && selectedMetrics.has('windSpeed') && (
                <Slider 
                    unit='windSpeed' 
                    label1='mph' 
                    label2='km/h' 
                    data={data} 
                    setData={setData} 
                    convertUnits={convertUnits} 
                />
            )}
       </div>
    );
}
export default WeatherPreferences;