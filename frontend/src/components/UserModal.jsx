import { useState } from "react";
import Modal from "./Modal";
// import "./Login.css"

function UserModal({ closeModal, userInfo, setUserInfo }) {
    const { username } = userInfo
    const [ userInput, setUserInput ] = useState({name: '', password: ''})

    return (
        <Modal title="Login" onClose={closeModal}>
            <h3 className="username">username</h3>
            <div className="">
                <button>
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