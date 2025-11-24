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
import StaffLogin from "./Routes/StaffLogin.jsx";
import GolfCourseCreation from "./Routes/GolfCourseCreation.jsx";
import Dashboard from "./Routes/MainDashboard.jsx";
import ActiveCourses from "./Routes/staff-dashboard/courses/ActiveCourses.jsx";
import TrashedCourses from "./Routes/staff-dashboard/courses/TrashedCourses.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="about" element={<About />} />
                <Route index path="memberships" element={<Memberships />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/staff/login" element={<StaffLogin />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="golfCourseRegistration" element={<GolfCourseRegistration />} />
                <Route path="/register"  element={<PlayerRegistrationPage />} />

                <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route index path="game/create" element={<GameMode />} />
                    <Route path="staff" >
                        <Route path="courses" >
				            <Route path="active" element={<ActiveCourses />} />
				            <Route path="trash" element={<TrashedCourses />} />
				            <Route path="create" element={<GolfCourseCreation />} />
                        </Route>
                    </Route>
					<Route path={""} element={<Dashboard />} />
                </Route>

                <Route path="score" element={<ScoreTable />} />
				<Route path="*" element={<PageNotFound />} />
            </Routes>
			<ToastContainer />
        </>
    );
}

export default App;
