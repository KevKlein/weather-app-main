import { useState } from "react";
import Modal from "./Modal";
import { fetchFavorites, fetchUnits } from '../utils/UserPreferences';
import "./LoginModal.css"

function LoginModal({ closeModal, userInfo, setUserInfo }) {
    const [ userInput, setUserInput ] = useState({username: '', password: ''})
    const [ isRegistering, setIsRegistering ] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    function handleUsernameChange(e) {
        const newValue = e.target.value;
        if (newValue.length < 16){
            setUserInput(u => ({ ...u, username: newValue }));
        }
    }
    function handlePasswordChange(e) {
        const newValue = e.target.value;
        setUserInput(u => ({ ...u, password: newValue }));
    }

    async function attemptLogin() {
        const { username, password } = userInput;
        if (!username) {
            setErrorMessage('Please enter a username');
            return;
        }
        const loginSucceeded = password.length > 0;   //update later with account validation
        if (!loginSucceeded) {
            setErrorMessage('Invalid credentials');
            return;
        }
        // If login succeeded, fetch into memory that user’s saved favorites and units from microservice:
        try {
            const [ savedFavorites, savedUnits ] = await Promise.all([
                fetchFavorites(username),
                fetchUnits(username),
            ]);
            setUserInfo({
                username,
                favorites: savedFavorites || [],
                units: savedUnits || { temperature: '°C', precipitation: 'mm', windSpeed: 'km/h' },
            });
            closeModal();
        } catch (err) {
            console.error('Login → problem fetching prefs:', err);
            setErrorMessage('Failed to load your preferences. Try again.');
        }
    }


    async function attemptRegister() {
        const { username, password } = userInput;
        if (!username) {
            setErrorMessage('Enter a username to register');
            return;
        }
        // TODO (replace with real POST /api/register)
        const registerSucceeded = password.length > 0;  //update later with account validation
        if (!registerSucceeded) {
            setErrorMessage('Choose a different password');
            return;
        }
        // On success, put an empty set of preferences in state: default units + no favorites
        setUserInfo({
            username,
            favorites: [],
            units: { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' },
        });
        closeModal();
    }

    return (
        <Modal title="Login / Register" onClose={closeModal}>
            <div className="login-modal-contents">
                <div className="fields-container">
                    <div className="field-wrapper">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            size={12}
                            title=""
                            value={userInput.username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className="field-wrapper">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="text"
                            size={12}
                            title=""
                            value={userInput.password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>
                {errorMessage && <p className="login-error">{errorMessage}</p>}
                <div className="button-container">
                    <button className="login-mode-button" onClick={e => attemptLogin()}>
                        Login
                    </button>
                    <button className="register-mode-button" onClick={e => attemptRegister()}>
                        Register
                    </button>
                </div>
            </div>
        </Modal>
    );
}
export default LoginModal;