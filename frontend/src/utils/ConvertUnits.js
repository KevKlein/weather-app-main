export function convertUnits(currentUnit, newUnit, dataPoints){
    if (currentUnit === newUnit) {
        console.log("convert units error: new units same as current");        
        return dataPoints;
    }

    let convertedDataPoints = [];

    dataPoints.forEach(entry => {
        const newEntry = convertEntry(currentUnit, newUnit, entry)
        convertedDataPoints.push(newEntry);
    });

    return convertedDataPoints;
}

function convertEntry(currentUnit, newUnit, entry) {
    let newEntry = {...entry}

    switch (currentUnit) {
        // temperature
        case '°C':  // C to F
            newEntry.temperature  = entry.temperature  * 9/5 - 32;
            newEntry.apparentTemp = entry.apparentTemp * 9/5 - 32;
            break;
        case '°F':  // F to C
            newEntry.temperature =  (entry.temperature  - 32) * 5/9;
            newEntry.apparentTemp = (entry.apparentTemp - 32) * 5/9;
            break;

        // precipitation
        case 'mm':  // mm to inches
            newEntry.precpitiation = entry.precipiation / 25.4;
            break;
        case 'inches':  // inches to mm
            newEntry.precpitiation = entry.precipiation * 25.4;
            break;

        // wind speed
        case 'km/h':  // km/h to mph
            newEntry.windSpeed = entry.windSpeed / 1.609344;
            break;
        case 'mph':  // mph to km/h
            newEntry.windSpeed = entry.windSpeed * 1.609344;
            break;

        default:
            console.log(`illegal arguments to convertUnit. currentUnit: ${currentUnit}, newUnit: ${newUnit} `);
            break;
    }
    return newEntry;
}







function getPrecision(number) {
  let str = number.toString();
  let decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

function isNumeric(num){
  return !(['', ' ', null].includes(num) || isNaN(num));
}


// convert temperature
// F to C: (F - 32) * (5/9)
// C to F: (C * (9/5)) + 32
function convertTemp(currentUnit, newUnit, temp, precision) {
//   if (!isNumeric(temp)) {
//     const msg = `${temp} (${typeof temp}) is not a valid temperature`;
//     return msg;
//   }

  if (currentUnit === newUnit) {
    return temp;
  } else if (currentUnit.toUpperCase().includes('F') && newUnit.toUpperCase().includes('C')) {
    return ((temp - 32) * (5/9)).toFixed(Math.max(1, precision));
  } else if (currentUnit.toUpperCase().includes('C') && newUnit.toUpperCase().includes('F')) {
    return ((temp * (9/5)) + 32).toFixed(Math.max(1, precision));
  } else {
    return `input temperature unit(s) invalid: "${currentUnit}", "${newUnit}".`
  }
}

// convert precipitation
// mm to in: mm / 25.4
// in to mm: in * 25.4
function convertPrecip(currentUnit, newUnit, precip, precision) {
//   if (!isNumeric(precip)) {
//     const msg = `${precip} (${typeof precip}) is not a valid precipitation measurement`;
//     return msg;
//   }

  if (currentUnit.toUpperCase() === newUnit.toUpperCase()) {
    return precip;
  } else if (currentUnit.toUpperCase().includes("INCH") && newUnit.toUpperCase() === "MM") {
    return ((precip * 25.4)).toFixed(Math.max(1, precision));
  } else if (currentUnit.toUpperCase() === "MM" && newUnit.toUpperCase().includes("INCH")) {
    return ((precip / 25.4)).toFixed(Math.max(3, precision));
  }  else {
    return `input precipitation unit(s) invalid: "${currentUnit}", "${newUnit}".`
  }
}

// convert speed
// km/h to mph: km / 1.60934
// mph to km/h: mph * 1.60934
function convertSpeed(currentUnit, newUnit, speed, precision) {
//   if (!isNumeric(speed)) {
//     const msg = `${speed} (${typeof speed}) is not a valid wind speed`;
//     return msg;
//   }

  if (currentUnit === newUnit) {
    return speed;
  } else if (currentUnit.toUpperCase() === "KM/H" && newUnit.toUpperCase() === "MPH") {
    return ((speed / 1.60934)).toFixed(Math.max(1, precision));
  } else if (currentUnit.toUpperCase() === "MPH" && newUnit.toUpperCase() === "KM/H") {
    return ((speed * 1.60934)).toFixed(Math.max(1, precision));
  } else {
    return `input wind speed unit(s) invalid: "${currentUnit}", "${newUnit}".`
  }
}





// const PORT = 4001;

// /* Convert units of weather data via POST to Microservice */
// export async function convertUnits(oldUnits, newUnits, weatherData) {

//     return weatherData; // temp
//     const url = `http://localhost:${PORT}/api/convert-units`;
//     console.log(`convertUnits: old `, oldUnits);
//     console.log(`convertUnits: new `, newUnits);

//     const payload = {
//         currentUnits: buildUnitsPayload(oldUnits),
//         newUnits: buildUnitsPayload(newUnits),
//         rawData: weatherData
//     }
    
//     try {
//         const resp = await fetch(url, {
//             method:  "POST",
//             headers: { "Content-Type": "application/json" },
//             body:    JSON.stringify(payload)
//         });
//         if (!resp.ok) {
//             throw new Error(`Convert‐units API returned HTTP ${resp.status}`);
//         }

//         const body = await resp.json();
//         const { conversions: { convertedData }} = body;
//         return convertedData;
//     }
//     catch (err) {
//         console.error("Error converting units:", err);
//         return null;
//     }
// }

// /** Transforms units to conform to microservice expected format.
//  *  Helper for convertUnits function.
//  */ 
// function buildUnitsPayload(UIunits) {
//     const payloadUnits = {
//         temperature: UIunits.temperature,
//         precipitation: UIunits.precipitation,
//         windSpeed: UIunits.windSpeed,
//     }
//     return payloadUnits;
// }
