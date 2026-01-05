import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation.jsx'
import HomePage from './pages/HomePage'
import WeatherPage from './pages/WeatherPage.jsx'
import HelpPage from './pages/HelpPage.jsx'
import UserModal from './components/UserModal';
import LoginModal from './components/LoginModal';
import './App.css';
import { FaDiceD20 } from 'react-icons/fa';
import { FaUser } from "react-icons/fa6";
import useVerifyToken from './hooks/useVerifyToken';
import { defaultUnits } from './constants';


/** 
 * TODO:
 * put on vercel
 * make unit conversions faster?
 * load JWT on page refresh?
 *   make user prefs load correctly DEBUG THIS
 * what to do if browser geolocation doesnt work
 * only show loading gif on geolocate if user has accepted popup?
 * change fake city name (coords) to either reverse geocode or just blank
 * authentication:
 * user preferences:
 *   migrate to mongoDB
*/ 


function App() {
  /*
  //   each dataPoints entry: [time, cloudCover, temperature, precipitation, precipitationChance, apparentTemp, humidity, windSpeed]
  */
  const [weatherData, setWeatherData] = useState({ lat: '', lon: '', dataPoints: [], units: {} });
  const [showUserModal, setShowUserModal] = useState(false);  // can be false, 'login', 'userAccount'


  // “userInfo” holds the currently‐logged‐in username (or null) their saved prefs.
  // "favorites" and "units" are mirrors of data.favorites and data.desiredUnits.
  const [ userInfo, setUserInfo ] = useState({ 
    username: null,      //  null or string
    favorites: [],       //  (mirror of data.favorites)
    units: defaultUnits
  });
  // Check for a signed JWT and show user logged in if present
  //  useVerifyToken(setUserInfo);


  // Default “no user logged in” behavior: clear out favorites & units
  useEffect(() => {
    if (!userInfo.username) {
      setWeatherData(d => ({
        ...d,
        favorites: [],
        desiredUnits: defaultUnits,
      }));
    }
  }, [userInfo.username]);

  
  // Whenever userInfo.units changes, push that into data.desiredUnits
  // useEffect(() => {
  //   if (!userInfo.username) return;
  //   setWeatherData(d => ({ ...d, desiredUnits: userInfo.units }));
  // }, [userInfo.units]);

  // Whenever userInfo.favorites changes, push that into data.favorites
  // useEffect(() => {
  //   if (!userInfo.username) return;
  //   setWeatherData(d => ({ ...d, favorites: userInfo.favorites }));
  // }, [userInfo.favorites]);

  function closeModal() {
    setShowUserModal(false);
  }

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
              : (<button className="nav-login-button" onClick={() => setShowUserModal('login')}>
                  <FaUser /> Log in / Register
                </button>)
            }
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage setShowUserModal={setShowUserModal} username={userInfo.username} /> } />
            <Route path="/weather" element={<WeatherPage weatherData={weatherData} setWeatherData={setWeatherData} userInfo={userInfo} setUserInfo={setUserInfo}/>} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} Kevin Klein</p>
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
