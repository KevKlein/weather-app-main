import { useCallback } from "react";

/**
 * Browser geolocation
 * Citation for geolocation code:
 *   Date: 2025.5.6
 *   Based on:
 *   https://www.w3schools.com/html/html5_geolocation.asp
 */
export function useGeolocation(setData, fetchAndConvertWeather) {
    const geolocate = useCallback(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(  // takes two functions: success and failure
            // success
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // fetch and parse weatherData
                fetchAndConvertWeather(lat, lon);  
                // update lat & lon form fields and save in data.current
                setData(d => ({
                    ...d,
                    inputVals: {lat, lon},
                    current: {...d.current, lat, lon}
                }));
            },
            // failure
            () => {
                alert("Geolocation didn't work.");
            }
        );
    }, [setData, fetchAndConvertWeather]);

    return { geolocate };
}
