import { useState } from "react";
import Modal from "./Modal";
import { fetchFavorites, fetchUnits } from '../utils/UserPreferences';
import "./LoginModal.css"
import { login as apiLogin, register as apiRegister} from "../utils/Authentication";
import { defaultUnits } from "../constants.js";

const loadingGif = {
    filepath: '/src/assets/loading.gif',
    alt: 'loading',
};


function LoginModal({ closeModal, setUserInfo, desiredUnits }) {
    const [ userInput, setUserInput ] = useState({ username: '', password: '' })
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ showLoadingIcon, setShowLoadingIcon ] = useState(false);

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

    /** Check if username and password match via auth-service.
     *  If successful, save signed JWT into user's local storage,
     *  load user’s preferences & saved locations.
    */
    async function attemptLogin() {
        const { username, password } = userInput;
        if (!username) {
            setErrorMessage('Please enter a username.');
            return;
        }
        if (!password) {
            setErrorMessage('Please enter a password.');
            return;
        }

        setShowLoadingIcon(true)
        const { message, token, error } = await apiLogin(username, password);
        console.log(`login attempt, message: ${message}, token: ${token}, error:${error}`);

        const loginSucceeded = (message == 'Logged in');
        if (!loginSucceeded) {
            setErrorMessage(error);
            setShowLoadingIcon(false)
            return;
        }
        try {
            localStorage.setItem('token', token);
            const [ savedFavorites, savedUnits ] = await Promise.all([
                fetchFavorites(username),
                fetchUnits(username),
            ]);
            setUserInfo({
                username,
                favorites: savedFavorites || [],
                units: savedUnits || defaultUnits,
            });
            setShowLoadingIcon(false);
            closeModal();
        } catch (err) {
            console.error('Login → problem fetching prefs:', err);
            setErrorMessage('Failed to load your preferences. Try again.');
            setShowLoadingIcon(false);
        }
    }

    /** Register username and password via auth-service.
     *  If successful, save signed JWT into user's local storage,
     *  save current units to user's new account.
    */
    async function attemptRegister() {
        const { username, password } = userInput;
        if (!username) {
            setErrorMessage('Please enter a username.');
            return;
        }
        if (!password) {
            setErrorMessage('Please enter a password.');
            return;
        }

        setShowLoadingIcon(true);
        const { message, token } = await apiRegister(username, password);
        const registerSucceeded = (message == 'Registered');
        if (!registerSucceeded) {
            setErrorMessage('Username taken. Choose a different username.');
            setShowLoadingIcon(false);
            return;
        }
        localStorage.setItem('token', token);
        setUserInfo({
            username,
            favorites: [],
            units: desiredUnits,
        });

        setShowLoadingIcon(false);
        closeModal();
    }

    return (
        <Modal title="Login / Register" onClose={closeModal}>
            <div className="login-modal-contents">
                <div className="fields-container">
                    <div className="field-wrapper">
                        <label htmlFor="username">Username</label>
                        <input
                            autoFocus
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
                            type="password"
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
                {showLoadingIcon && 
                <div className="loading-icon">
                    <figure className='loading'>
                        <img src={loadingGif.filepath} alt={loadingGif.alt} />
                    </figure>
                </div>
                }
            </div>
        </Modal>
    );
}
export default LoginModal;