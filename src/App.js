import {
    BrowserRouter as Router,
    Routes,
    Route,
    Switch,
    Link
} from "react-router-dom";

import Landing from './Pages/Landing/Landing.js';
import Login from './Pages/Login/Login.js';
import Signup from './Pages/Signup/Signup.js';
import Scheduler from './Pages/Scheduler/Scheduler.js';
import NotFound from './Pages/NotFound/NotFound.js';

const App = () => {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;