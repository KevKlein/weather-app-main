import { useEffect } from 'react';
import { FaDiceD20 } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { WiDayRainWind } from "react-icons/wi";
import { useNavigate } from 'react-router-dom';


function HomePage(){
    useEffect(() => {
        document.body.classList.add('homepage');
        return () => {
        document.body.classList.remove('homepage');
        };
    }, []);

    const navigate = useNavigate();

    return (
        <>
            <section className='home-section'>
                <article>                  
                    {/* <i FiSun /> <i FaDiceD20 /> <i WiDayRainWind /> */}
                    <h2> Nat20 Weather</h2>
                    <p>Nat20 Weather provides detailed hourly weather forecasting for any location in the world. Get the weather by latitude and longitude, or have your browser get your coordinates for you. Create an account so you can save your favorite locations and preferred units for next time.</p>
                    <div>
                        <button onClick={() => navigate('/weather')}>
                            Get Your Forecast
                        </button>
                    </div>
                    
                    
                </article>
            </section>
        </>
    )
}

export default HomePage;