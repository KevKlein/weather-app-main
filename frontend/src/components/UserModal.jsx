import { useState } from "react";
import Modal from "./Modal";
// import "./Login.css"

function UserModal({ closeModal, userInfo, setUserInfo }) {
    const { username } = userInfo
    const [ userInput, setUserInput ] = useState({name: '', password: ''})

    function handleLogout() {
        setUserInfo({ username: null, favorites: [], units: { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' } });
        closeModal();
    }

    return (
        <Modal title="Login" onClose={closeModal}>
            <h3 className="username">username</h3>
            <div className="">
                <button onClick={handleLogout}>
                    logout
                </button>
                <button>
                    delete account
                </button>
            </div>
        </Modal>
    );
}
export default UserModal;