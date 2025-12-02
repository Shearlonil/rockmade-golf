import React from "react";
import { useAuthUser } from "../app-context/user-context";
import StaffDashboard from "./staff-dashboard/StaffDashboard";
import ClientDashboard from "./client-dashboard/ClientDashboard";
import cryptoHelper from "../Utils/crypto-helper";

const Dashboard = () => {

    const { authUser } = useAuthUser();
	const user = authUser();

	const display = () => user && cryptoHelper.decryptData(user.mode) === '0' ? <StaffDashboard /> : <ClientDashboard /> ;

	return ( <React.Fragment>{ display() }</React.Fragment> );
}

export default Dashboard;