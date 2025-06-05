import { useState } from "react";
import { deleteUser as apiDeleteUser } from "../utils/UserPreferences";
import Modal from "./Modal";
import "./UserModal.css"

function UserModal({ closeModal, userInfo, setUserInfo }) {
    const { username } = userInfo
    const defaultUnits = { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' };

    function handleLogout() {
        setUserInfo({ username: null, favorites: [], units: defaultUnits});
        closeModal();
    }

    function handleDeleteUser() {
        apiDeleteUser(username);
        handleLogout();
    }

    return (
        <Modal title={username} onClose={closeModal}>
            <div className="user-modal-contents">
                <div className="button-container">
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                    <button onClick={handleDeleteUser}>
                        Delete Account
                    </button>
                </div>
            </div>
        </Modal>
    );
}
export default UserModal;