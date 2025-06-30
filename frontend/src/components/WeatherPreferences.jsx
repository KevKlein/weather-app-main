import Slider from "./Slider";

function WeatherPreferences({data, setData, userInfo, setUserInfo, convertUnits, selectedMetrics}) {

    return (
       <div className="weatherSliders">
            { data.weather.dataPoints[0] 
              && ((selectedMetrics.has('temperature') || selectedMetrics.has('apparentTemp'))) && (
                <Slider 
                    unitKey='temperature' 
                    label1='°F' 
                    label2='°C' 
                    data={data} 
                    setData={setData} 
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
            { data.weather.dataPoints[0] && selectedMetrics.has('precipitation') && (
                <Slider 
                    unitKey='precipitation' 
                    label1='inches' 
                    label2='mm' 
                    data={data} 
                    setData={setData}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
            { data.weather.dataPoints[0] && selectedMetrics.has('windSpeed') && (
                <Slider 
                    unitKey='windSpeed' 
                    label1='mph' 
                    label2='km/h' 
                    data={data} 
                    setData={setData}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
       </div>
    );
}
export default WeatherPreferences;