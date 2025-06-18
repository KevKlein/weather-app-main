/* Convert units of weather data via POST to Microservice */
export async function convertUnits(oldUnits, newUnits, weatherData) {
    const url = "http://localhost:36101/api/convert-units";
    console.log(`convertUnits: old `, oldUnits);
    console.log(`convertUnits: new `, newUnits);

    const payload = {
        currentUnits: buildUnitsPayload(oldUnits),
        desiredUnits: buildUnitsPayload(newUnits),
        rawData: weatherData
    }
    
    try {
        const resp = await fetch(url, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload)
        });
        if (!resp.ok) {
            throw new Error(`Convert‐units API returned HTTP ${resp.status}`);
        }

        const body = await resp.json();
        const { conversions: { convertedData }} = body;
        return convertedData;
    }
    catch (err) {
        console.error("Error converting units:", err);
        return null;
    }
}

/** Transforms units to conform to microservice expected format.
 *  Helper for convertUnits function.
 */ 
function buildUnitsPayload(UIunits) {
    const payloadUnits = {
        temperature: UIunits.temperature,
        precipitation: UIunits.precipitation,
        windSpeed: UIunits.windSpeed,
    }
    return payloadUnits;
}
