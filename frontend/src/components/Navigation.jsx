import { Link } from 'react-router-dom';


function Navigation() {

    return (
       <div className='nav-outer'>
            <nav className='pages-nav'>
                <Link to="/">Home</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/help">Help</Link>
            </nav>
       </div>
    );
}
export default Navigation;