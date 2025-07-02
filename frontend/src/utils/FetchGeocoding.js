/** 
 * Get location data, including lat & lon, via geolocation microservice.
 * Several search results can be returned.
 * State and Country can be written out or abbreviated as state/country codes. 
 *   See https://www.countrycode.org/ for country codes.
 *   State and country are optional, can be left blank.
*/
export async function fetchGeocoding(city, state, country, numResultsSought=5) {
  const reqPayload = {
    city,
    state,
    country,
    numResultsSought
  };

  try {
    const res = await fetch('http://localhost:36120/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqPayload)
    });

    if (!res.ok) {
      throw new Error(`Couldn't fetch geocoding.`)
    }

    const data = await res.json();
    return data;
    
  } catch (error) {
    console.error(`Error fetching geocoding: ${error}`);
    return null;
  }
}
