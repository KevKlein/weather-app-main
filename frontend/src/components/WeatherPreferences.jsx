import Slider from "./Slider";

function WeatherPreferences({data, setData, convertUnits}) {
    const { desiredUnits, current} = data;
    function debug() {
        console.log(current.units, '\n',desiredUnits);
    }

    return (
       <div className="weatherSliders">
            <Slider data={data} setData={setData} convertUnits={convertUnits} unit='temperature' label1='°F' label2='°C' />
            <Slider data={data} setData={setData} convertUnits={convertUnits} unit='precipitation' label1='inches' label2='mm' />
            <Slider data={data} setData={setData} convertUnits={convertUnits} unit='windSpeed' label1='mph' label2='km/h' />
            <button onClick={debug}>
                debug
            </button>
       </div>
    );
}
export default WeatherPreferences;