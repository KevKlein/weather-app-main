const PORT = 36104;

/** 
 * Attempt to register account using authentication microservice.
 * Recieves signed JWT on registration success and stores in local storage.
 * Return true if registration succeeds, else false.
*/
export async function register(username, password) {
    const url = `http://localhost:${PORT}/api/register`;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const { message, token } = await resp.json()
        console.log(`authentication: message ${message} token ${token}`);
        return { message, token }

    } catch (err) {
        return { message: err.status, token: '' };
    }
}

export async function login(username, password) {
    const url = `http://localhost:${PORT}/api/login`;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const { message, token } = await resp.json()
        return { message, token }

    } catch (err) {
        return { message: err.status, token: '' };
    }
}

export async function deleteAccount() {
    const url = `http://localhost:${PORT}/api/delete-account`;
    const token = localStorage.getItem('token');
    try {
        const resp = await fetch(url, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const { message } = await resp.json()
        return { message }
    } catch (err) {
        return { message: err.status };
    }
}