const PORT = 36121;

/* ----- Favorite locations ----- */
/* Fetch user favorite locations */
export async function fetchFavorites(username) {
  const url = `http://localhost:${PORT}/favorite?username=${username}`
  console.log(`fetch favorite url: `, url);
  const res = await fetch(url);
  return (res.ok) ? (await res.json()).favorites : [];
}

export async function addFavorite(username, loc) {
  const res = await fetch(`http://localhost:${PORT}/favorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, ...loc })
  });
  return res.ok ? (await res.json()).favorites : [];
}

export async function removeFavorite(username, lat, lon) {
  const res = await fetch(`http://localhost:${PORT}/favorite`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, lat, lon })
  });
  return res.ok ? (await res.json()).favorites : [];
}

/* ----- Preferred Units ----- */
export async function fetchUnits(username) {
  const url = `http://localhost:${PORT}/units?username=${username}`
  console.log(`fetch favorite url: `, url);
  const res = await fetch(url);
  return (res.ok) ? (await res.json()).favorites : [];
}

export async function updateUnits(username, units) {
  const res = await fetch(`http://localhost:${PORT}/units`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, ...units })
  });
  return res.ok ? (await res.json()).units : [];
}