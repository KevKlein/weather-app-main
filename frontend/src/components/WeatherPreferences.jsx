import Slider from "./Slider";

function WeatherPreferences({data, setData}) {

    return (
       <>
            <Slider data={data} setData={setData} unit='temperature' label1='°F' label2='°C' />
            <Slider data={data} setData={setData} unit='precipitation' label1='inch' label2='mm' />
            <Slider data={data} setData={setData} unit='windSpeed' label1='mph' label2='km/h' />
       </>
    );
}
export default WeatherPreferences;