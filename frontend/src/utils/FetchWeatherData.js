// Fetch weather data via api url to open-meteo, using current lat & lon. 
// Data is in JSON format.
export async function fetchWeatherData(lat, lon) {
    const metrics = 
        'temperature_2m,'
        + 'apparent_temperature,'
        + 'precipitation,'
        + 'precipitation_probability,'
        + 'cloud_cover,'
        + 'relative_humidity_2m,'
        + 'wind_speed_10m';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${metrics}&timezone=auto`;
    console.log(`url: `, url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Couldn't fetch weather data from online source ${url}`);
        const data = await response.json();
        const parsedData = await parseWeatherData(data);
        return parsedData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

/* Parse raw weather data */
function parseWeatherData(rawData) {
    const times = rawData.hourly.time;
    const data = times.map((time, i) => ({
        time,
        cloudCover: rawData.hourly.cloud_cover[i],
        temperature: rawData.hourly.temperature_2m[i],
        precipitation: rawData.hourly.precipitation[i],
        precipitationChance: rawData.hourly.precipitation_probability[i],
        apparentTemp: rawData.hourly.apparent_temperature[i],
        humidity: rawData.hourly.relative_humidity_2m[i],
        windSpeed: rawData.hourly.wind_speed_10m[i],
    }));
    return data;
}