import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa6";
import { useState } from 'react';
import UserModal from './UserModal';
import LoginModal from './LoginModal';

function Navigation({userInfo, setUserInfo}) {

    const [showUserModal, setShowUserModal] = useState(null);

    function closeModal() {
        setShowUserModal(false);
    }

    return (
       <div className='nav-outer'>
            <nav className='pages-nav'>
                <Link to="/">Home</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/help">Help</Link>
            </nav>

            <div className='login-button-container'>
                {(userInfo.username) 
                    ? (<button className="nav-login-button" onClick={() => setShowUserModal('userAccount')}>
                            <FaUser /> {userInfo.username}
                        </button>) 
                    : (<button className="nav-login-button" onClick={() => setShowUserModal('login')}>
                            <FaUser /> login
                        </button>)
                }
            </div>

            {showUserModal === 'userAccount' && 
                <UserModal 
                    closeModal={closeModal}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                />
            }
            {showUserModal === 'login' && 
                <LoginModal 
                    closeModal={closeModal}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                />
            }
       </div>
    );
}
export default Navigation;