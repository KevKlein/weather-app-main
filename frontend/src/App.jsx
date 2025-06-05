import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import HomePage from './pages/HomePage'
import WeatherPage from './pages/WeatherPage.jsx'
import HelpPage from './pages/HelpPage.jsx'
import UserModal from './components/UserModal';
import LoginModal from './components/LoginModal';
import {
    fetchFavorites,
    addFavorite as apiAddFavorite,
    removeFavorite as apiRemoveFavorite,
    fetchUnits as apiFetchUnits,
    updateUnits as apiUpdateUnits,
} from './utils/UserPreferences';
import './App.css'
import { FaDiceD20 } from 'react-icons/fa'
import { FaUser } from "react-icons/fa6";


function App() {

  // “data” holds all info relevant to the WeatherPage: recents, chart units, current weather, favorites
  const [data, setData] = useState({
      desiredUnits: { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' },
      current: { lat: '', lon: '', weather: [], units: {} },
      recents: [],    // (entries are same shape as the dummy entry in 'current')
      favorites: [],  // (entries are same shape as the dummy entry in 'current')
  })
  
  // “userInfo” holds the currently‐logged‐in username (or null) their saved prefs.
  // "favorites" and "units" are mirrors of data.favorites and data.desiredUnits.
  const [ userInfo, setUserInfo ] = useState({ 
    username: null,      // null | string
    favorites: [],       //  (mirror of data.favorites)
    units: { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' }
  })

  const [showUserModal, setShowUserModal] = useState(null);

  function closeModal() {
    setShowUserModal(false);
  }

  function handleLoginButton() {
    setShowUserModal('login');
  }

  // Default “no user logged in” behavior: clear out favorites & units
  useEffect(() => {
    if (!userInfo.username) {
      setData(d => ({
        ...d,
        favorites: [],
        desiredUnits: { temperature: '°F', precipitation: 'inches', windSpeed: 'mph' },
      }));
    }
  }, [userInfo.username]);

  
  // Whenever userInfo.units changes, push that into data.desiredUnits
  useEffect(() => {
    if (!userInfo.username) return;
    setData(d => ({ ...d, desiredUnits: userInfo.units }));
  }, [userInfo.units]);

  // Whenever userInfo.favorites changes, push that into data.favorites
  useEffect(() => {
    if (!userInfo.username) return;
    setData(d => ({ ...d, favorites: userInfo.favorites }));
  }, [userInfo.favorites]);


  return (
    <Router>
      <div className="app-wrapper">
        <header>
          <div className='header-left'>
            <h1>
              <FaDiceD20 className="header-icon" />
              Nat20 Weather
            </h1>
            <Navigation />
          </div>
          <div className='login-button-container'>
            {(userInfo.username) 
              ? (<button className="nav-login-button" onClick={() => setShowUserModal('userAccount')}>
                  <FaUser /> {userInfo.username}
                </button>) 
              : (<button className="nav-login-button" onClick={handleLoginButton}>
                  <FaUser /> login
                </button>)
            }
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage /> } />
            <Route path="/weather" element={<WeatherPage data={data} setData={setData} userInfo={userInfo} setUserInfo={setUserInfo}/>} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} Kevin Klein</p>
        </footer>

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
    </Router>
  )
}

export default App
