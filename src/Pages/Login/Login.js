import './Login.css';
import Nav from "../../Components/Nav/Nav";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import login from "../../Assets/login.png";
import { auth, db } from "../../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";


import {

    Link, useNavigate
} from "react-router-dom";
import { useState } from 'react';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) =>{
                console.log(userCredential.user);
                localStorage.setItem('authUser', JSON.stringify(userCredential.user))
                navigate('/scheduler')
            });
            
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="signupPage">
            <div className="nav">
                <Nav />
            </div>
            <div className="signupBody">
                <div className="signupLeft">
                    <p className='start'>Login to begin scheduling</p>
                    <h2 className='create'>Welcome back<span className='period'>.</span></h2>
                    <p className='signupQuestion'>Need an account? <span><Link to="/signup" className='loginLink'>Sign up</Link></span></p>
                    <form onSubmit={handleSubmit}>

                        <TextField className="email" required value={email} onChange={e => setEmail(e.target.value)} id="outlined-basic" label="Email" variant="outlined" InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EmailIcon style={{ color: '#EEA835' }} />
                                </InputAdornment>
                            ),
                        }} />
                        <div className="divider"></div>

                        <TextField className="email" required value={password} onChange={e => setPassword(e.target.value)} id="outlined-basic" label="Password" variant="outlined" type={showPassword ? 'text' : 'password'} InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff style={{ color: '#EEA835' }} /> : <Visibility style={{ color: '#EEA835' }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }} />
                        <div className="divider"></div>
                        <Button variant="contained" type="submit" style={{
                            textTransform: 'none', backgroundColor: '#EEA835', width: '100%', marginTop: '0px', padding:
                                '15px', fontSize: '16px'
                        }}>Login</Button>

                    </form>
                    {error && <p>{error}</p>}
                </div>
                <div className="signupRight">
                    <div className="img">
                        <img src={login} alt="login" />
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Login;