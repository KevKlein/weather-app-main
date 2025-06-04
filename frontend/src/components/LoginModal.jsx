import { useState } from "react";
import Modal from "./Modal";
import "./Login.css"

function LoginModal({ closeModal, userInfo, setUserInfo }) {
    const [ userInput, setUserInput ] = useState({username: '', password: ''})
    const [ isRegistering, setIsRegistering ] = useState(false)

    function handleUsernameChange(e) {
        const newValue = e.target.value;
        if (newValue.length < 16){
            setUserInput({
                ...userInput,
                username: newValue
            });
        }
    }
    function handlePasswordChange(e) {
        const newValue = e.target.value;
        setUserInput({
            ...userInput,
            password: newValue
        })
    }

    function attemptLogin() {
        if (true) {   //update later with account validation
            loginSuccess()
        } else {
            loginFailure()
        }
    }

    function loginSuccess() {
        setUserInfo({
            ...info,
            username: userInput.username,
        })
    }

    function loginFailure() {
        // display some kind of message to user
    }

    function attemptRegister() {
        // TODO just use username and call it successful
        // TODO later: do something with password after authentication microservice
        // for now just ignore password
    }

    function registerSuccess() {
        // put current set of user units and favorited locations into entry for the chosen username
        // log in as that user
        // alert: "Registered as {username}!"
        closeModal()
    }

    function registerFailure() {
        // put error message under password input field
    }

    return (
        <Modal title="Login" onClose={closeModal}>
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
                            onChange={(e) => handleUsernameChange(e)}
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
                            onChange={(e) => handlePasswordChange(e)}
                        />
                    </div>
                </div>
                <div className="button-container">
                    <button className="login-mode-button" onClick={e => attemptLogin()}>
                        login
                    </button>
                    <button className="register-mode-button" onClick={e => attemptRegister()}>
                        register
                    </button>
                </div>
            </div>
        </Modal>
    );
}
export default LoginModal;