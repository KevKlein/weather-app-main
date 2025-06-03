import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa6";
import { useState } from 'react';

function Navigation({userInfo, setUserInfo}) {

    const [showUserModal, setShowUserModal] = useState(false);

    return (
       <>
           <nav className='pages-nav'> 
                <Link to="/">Home</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/help">Help</Link>
                { userInfo.username
                    ? <Link to="/login"><FaUser /> {userInfo.username}</Link>
                    : <Link to="/login"><FaUser /> Login</Link>
                }
            </nav>
            { showUserModal && ({
                
            })}
       </>
    );
}
export default Navigation;