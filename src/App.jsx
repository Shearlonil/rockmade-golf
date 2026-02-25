import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./Routes/Home.jsx";
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
import GolfCourseCreation from "./Routes/Dashboard/staff-dashboard/GolfCourseCreation.jsx";
import Courses from "./Routes/Dashboard/staff-dashboard/courses/Courses.jsx";
import GolfCourseView from "./Routes/Dashboard/staff-dashboard/courses/GolfCourseView.jsx";
import Contests from "./Routes/Dashboard/staff-dashboard/Contests.jsx";
import Staff from "./Routes/Dashboard/staff-dashboard/users/Staff.jsx";
import GameBoard from "./Routes/Dashboard/client-dashboard/game-board/GameBoard.jsx";
import Dashboard from "./Routes/Dashboard/MainDashboard.jsx";
import Profile from "./Routes/Dashboard/MyProfilePage/MainProfile.jsx";
import RecentGames from "./Routes/Dashboard/client-dashboard/recent-games/RecentGames.jsx";
import GameSummary from "./Routes/Dashboard/client-dashboard/recent-games/GameSummary.jsx";

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
                <Route path="/register"  element={<PlayerRegistrationPage />} />

                <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route index path="game/create" element={<GameMode />} />
                    <Route index path="contests" element={<Contests />} />
                    <Route index path="users" element={<Staff />} />
                    <Route index path="profile" element={<Profile />} />
                    <Route path="staff" >
                        <Route path="courses" >
                            <Route path=":id/view" element={<GolfCourseView />} />
				            <Route path="create" element={<GolfCourseCreation />} />
				            <Route path="" element={<Courses />} />
                        </Route>
                    </Route>
                    <Route path="client" >
                        <Route path=":id/game/:name" element={<GameBoard />} />
                        <Route path="games/recent" element={<RecentGames />} />
                        <Route path="games/recent/:id" element={<GameSummary />} />
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
