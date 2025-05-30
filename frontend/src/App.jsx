import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FaDiceD20 } from 'react-icons/fa'
import Navigation from './components/Navigation.jsx'
import HomePage from './pages/HomePage'
import WeatherPage from './pages/WeatherPage.jsx'
import HelpPage from './pages/HelpPage.jsx'
import './App.css'

function App() {

  const [data, setData] = useState({
      units: { temperature: '°F', precipitation: 'inch', windSpeed: 'mph' },
      inputVals: { lat: '', lon: '' },
      current: { lat: '', lon: '', weather: [] },
      prev: { lat: '', lon: '', weather: [] },
  })

  return (
    <Router>
      <div className="app-wrapper">
        <header>
          <h1>
            <FaDiceD20 className="header-icon" />
            Nat20 Weather
          </h1>
          <Navigation data={data} setData = {setData}/>
        </header>

        <main>
          <Routes>
            <Route path="/"       element={<HomePage   />} />
            <Route path="/weather" element={<WeatherPage data={data} setData={setData} />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} Kevin Klein</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
