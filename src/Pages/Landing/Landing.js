import Nav from "../../Components/Nav/Nav";
import './Landing.css';
import landing from "../../Assets/landing.png";
import {
   
    Link
} from "react-router-dom";

const Landing = () => {
    return ( 
        <div className="landing">
            <div className="nav">
                <Nav />
                <div className="buttons">
                    <Link to = "/login" className="login"><button>Log in</button></Link>
                    <Link to = "/signup" className="signup"><button>Sign up</button></Link>
                </div>
            </div>
            <div className="body">
                <div className="info">
                    <h1 className="statement">The scheduling app everyone loves.</h1>
                    <p className="about">Make a free account in seconds from your computer and start scheduling</p>
                    <Link to = "/signup" className="signupButton"><button>Get started</button></Link>
                </div>
                <div className="img">
                    <img src={landing} alt="landing"/>
                </div>
            </div>
            

        </div>
     );
}
 
export default Landing;