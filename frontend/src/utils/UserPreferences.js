const PORT = 4003;

/* ----- Favorite locations ----- */
/* Fetch a user's "favorites" array. Can be [], returns [] on error. */
export async function fetchFavorites(username) {
  const url = `http://localhost:${PORT}/api/favorites?username=${username}`
  const res = await fetch(url);
  return res.ok ? (await res.json()).favorites : [];
}

/** Add a favorited location to the "favorites" array for this user.
 *  loc should have shape: { city, state, country, lat, lon, isCity } 
*/
export async function addFavorite(username, loc) {
  const url = `http://localhost:${PORT}/api/favorites`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, ...loc })
  });
  return res.ok ? (await res.json()).favorites : [];
}

/* Delete a location from the user's saved favorites. */
export async function removeFavorite(username, lat, lon) {
  const url = `http://localhost:${PORT}/api/favorites`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, lat, lon })
  });
  return res.ok ? (await res.json()).favorites : [];
}

/* ----- Preferred Units ----- */
/* Fetch a user's preferred units dict. Returns {} on error. */
export async function fetchUnits(username) {
  const url = `http://localhost:${PORT}/api/units?username=${username}`
  const res = await fetch(url);
  return (res.ok) 
  ? (await res.json()).units 
  : {}; // maybe send default units?
}

/* Update a user’s unit preferences. Returns updated units object on success, else {}. */
export async function updateUnits(username, newUnits) {
  const url = `http://localhost:${PORT}/api/units`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, units: newUnits })
  });
  return res.ok ? (await res.json()).units : {};
}

/* Delete a user's saved information */
export async function deleteUser(username) {
  const url = `http://localhost:${PORT}/api/delete-user`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  return res.ok ? (await res.json()).message : '';
}