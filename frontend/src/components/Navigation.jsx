import { Link } from 'react-router-dom';
import WeatherPreferences from './WeatherPreferences';

function Navigation({data, setData}) {
    return (
       <>
           <nav className='pages-nav'> 
                <Link to="/">Home</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/help">Help</Link>
            </nav>
            <WeatherPreferences data={data} setData={setData} />
       </>
    );
}
export default Navigation;