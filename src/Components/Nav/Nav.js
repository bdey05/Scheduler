import './Nav.css';
import {
   
    Link
} from "react-router-dom";

const Nav = () => {
    return ( 
        <div className="nav">
            <Link to = "/" className='navLogo'><h1>scheduley</h1></Link>
        </div>
     );
}
 
export default Nav;