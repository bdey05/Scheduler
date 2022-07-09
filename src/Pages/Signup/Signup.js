import './Signup.css';
import Nav from "../../Components/Nav/Nav";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import signup from "../../Assets/signup.png";
import { auth, db } from "../../firebase.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    setDoc,
    doc,
} from "firebase/firestore";


import {
    Link, useNavigate
} from "react-router-dom";
import { useState } from 'react';



const Signup = () => {


    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            localStorage.setItem('authUser', JSON.stringify(user));
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName,
                lastName,
                authProvider: "local",
                email,
                tasks: [],
            });
            navigate('/scheduler')
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
                    <p className='start'>Start for free</p>
                    <h2 className='create'>Create a new account<span className='period'>.</span></h2>
                    <p className='signupQuestion'>Already a member? <span><Link to="/login" className='loginLink'>Log in</Link></span></p>
                    <form onSubmit={handleSubmit}>
                        <div className="oneline">
                            <TextField id="outlined-basic" required value={firstName} onChange={e => setFirstName(e.target.value)} label="First Name" variant="outlined" InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <AccountCircle style={{ color: '#EEA835' }} />
                                    </InputAdornment>
                                ),
                            }} />
                            <TextField id="outlined-basic" required value={lastName} onChange={e => setLastName(e.target.value)} label="Last Name" variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <AccountCircle style={{ color: '#EEA835' }} />
                                        </InputAdornment>
                                    ),
                                }} />
                        </div>
                        <TextField className="email" id="outlined-basic" required value={email} onChange={e => setEmail(e.target.value)} label="Email" variant="outlined" InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <EmailIcon style={{ color: '#EEA835' }} />
                                </InputAdornment>
                            ),
                        }} />
                        <div className='divider'></div>
                        <TextField className="email" id="outlined-basic" required value={password} onChange={e => setPassword(e.target.value)} label="Password" variant="outlined" type={showPassword ? 'text' : 'password'} InputProps={{
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
                        <Button variant="contained" type="submit" style={{
                            textTransform: 'none', backgroundColor: '#EEA835', width: '100%', marginTop: '20px', padding:
                                '15px', fontSize: '16px'
                        }}>Create Account</Button>

                    </form>
                    {error && <p>{error}</p>}
                </div>
                <div className="signupRight">
                    <div className="img">
                        <img src={signup} alt="signup" />
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Signup;