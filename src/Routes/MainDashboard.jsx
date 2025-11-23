import React from "react";
import { useAuthUser } from "../app-context/user-context";
import StaffDashboard from "./staff-dashboard/StaffDashboard";
import ClientDashboard from "./client-dashboard/ClientDashboard";

const Dashboard = () => {

    const { authUser } = useAuthUser();
	const user = authUser();

	const display = () => user.sub === undefined ? <StaffDashboard /> : <ClientDashboard /> ;

	return ( <React.Fragment>{ display() }</React.Fragment> );
}

export default Dashboard;