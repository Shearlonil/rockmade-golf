import { Route, Routes } from "react-router-dom";
import Home from "./Routes/Home.jsx";
import GolfCourseRegistration from "./Routes/GolfCourseRegistration.jsx";
import About from "./Routes/About.jsx";
import Memberships from "./Routes/Memberships.jsx";
import GameMode from "./Routes/GameMode.jsx";
import LoginPage from "./Routes/LoginPage.jsx";
import SignUpPage from "./Routes/SignupPage.jsx";
import PlayerRegistrationPage from "./Routes/PlayerRegistrationPage.jsx";
import ScoreTable from './Routes/ScoreTable';
import { ToastContainer } from "react-toastify";

function App() {
    return (
        <>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="about" element={<About />} />
                <Route index path="memberships" element={<Memberships />} />
                <Route index path="gameMode" element={<GameMode />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="golfCourseRegistration" element={<GolfCourseRegistration />} />
                <Route path="/register"  element={<PlayerRegistrationPage />} />

                <Route path="score" element={<ScoreTable />} />
            </Routes>
			<ToastContainer />
        </>
    );
}

export default App;
