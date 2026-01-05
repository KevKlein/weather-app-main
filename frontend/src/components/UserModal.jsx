import { deleteUser as apiDeleteUserPrefs } from "../utils/UserPreferences";
import { deleteAccount as apiDeleteAccount } from "../utils/Authentication";
import Modal from "./Modal";
import { defaultUnits } from "../constants";
import "./UserModal.css"

function UserModal({ closeModal, userInfo, setUserInfo }) {
    const { username } = userInfo

    function handleDeleteUser() {
        apiDeleteUserPrefs(username);
        apiDeleteAccount();
        handleLogout();
    }

    function handleLogout() {
        localStorage.removeItem('token');
        setUserInfo({ username: null, favorites: [], units: defaultUnits});
        closeModal();
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