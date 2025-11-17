import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./Routes/Home.jsx";
import GolfCourseRegistration from "./Routes/GolfCourseRegistration.jsx";
import About from "./Routes/About.jsx";
import Memberships from "./Routes/Memberships.jsx";
import GameMode from "./Routes/GameMode.jsx";
import LoginPage from "./Routes/LoginPage.jsx";
import SignUpPage from "./Routes/SignupPage.jsx";
import PlayerRegistrationPage from "./Routes/PlayerRegistrationPage.jsx";
import ScoreTable from './Routes/ScoreTable';
import PageNotFound from './Routes/PageNotFound';
import { ProtectedRoute } from './Routes/ProtectedRoute';
import ClientDashboard from "./Routes/client-dashboard/ClientDashboard.jsx";
import StaffLogin from "./Routes/StaffLogin.jsx";
import StaffDashboard from "./Routes/staff-dashboard/StaffDashboard.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="about" element={<About />} />
                <Route index path="memberships" element={<Memberships />} />
                <Route index path="gameMode" element={<GameMode />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="golfCourseRegistration" element={<GolfCourseRegistration />} />
                <Route path="/register"  element={<PlayerRegistrationPage />} />

                <Route path="/dashboard" element={<ProtectedRoute />}>
					<Route path={""} element={<ClientDashboard />} />
                </Route>

                <Route path="/staff/dashboard" element={<ProtectedRoute />}>
					<Route path={""} element={<StaffDashboard />} />
                </Route>

                <Route path="score" element={<ScoreTable />} />
				<Route path="*" element={<PageNotFound />} />
            </Routes>
			<ToastContainer />
        </>
    );
}

export default App;
