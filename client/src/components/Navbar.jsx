import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

function Navbar(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    function handleLogout(){
        localStorage.clear()
        navigate('/login')
    }

  return (
    <>
        <div className='flex flex-row justify-around text-auto bg-amber-50 p-1 md:text-2xl' style={{fontFamily: 'Gabriela'}}>
            <Link className='hover:scale-110 duration-200' to={"/login"}>Thinkofyou</Link>
            <Link className='hover:scale-110 duration-200' > About Us</Link>
            <Link className='hover:scale-110 duration-200' to={"/playlist"}>The Playlist</Link>
            <Link className='hover:scale-110 duration-200'>Contact Us</Link>
            {token && <button className='hover:scale-110 duration-200' onClick={handleLogout}>Logout</button>}
        </div>
    </>

    );
};

export default Navbar; 