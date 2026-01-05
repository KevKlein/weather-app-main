import Slider from "./Slider";

function SliderGroup({weatherData, setWeatherData, sliderUnits, setSliderUnits, userInfo, setUserInfo, convertUnits, selectedMetrics}) {

    return (
       <div className="weatherSliders">
            { weatherData.dataPoints[0] 
              && ((selectedMetrics.has('temperature') || selectedMetrics.has('apparentTemp'))) && (
                <Slider 
                    unitKey='temperature' 
                    label1='°F' 
                    label2='°C' 
                    weatherData={weatherData}
                    setWeatherData={setWeatherData}
                    sliderUnits={sliderUnits}
                    setSliderUnits={setSliderUnits}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
            { weatherData.dataPoints[0] && selectedMetrics.has('precipitation') && (
                <Slider 
                    unitKey='precipitation' 
                    label1='inches' 
                    label2='mm' 
                    weatherData={weatherData} 
                    setWeatherData={setWeatherData}
                    sliderUnits={sliderUnits}
                    setSliderUnits={setSliderUnits}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
            { weatherData.dataPoints[0] && selectedMetrics.has('windSpeed') && (
                <Slider 
                    unitKey='windSpeed' 
                    label1='mph' 
                    label2='km/h' 
                    weatherData={weatherData} 
                    setWeatherData={setWeatherData}
                    sliderUnits={sliderUnits}
                    setSliderUnits={setSliderUnits}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    convertUnits={convertUnits} 
                />
            )}
       </div>
    );
}
export default SliderGroup;