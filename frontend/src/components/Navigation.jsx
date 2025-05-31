import { Link } from 'react-router-dom';

function Navigation({data, setData}) {
    return (
       <>
           <nav className='pages-nav'> 
                <Link to="/">Home</Link>
                <Link to="/weather">Weather</Link>
                <Link to="/help">Help</Link>
            </nav>
       </>
    );
}
export default Navigation;