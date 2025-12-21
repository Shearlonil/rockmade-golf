import React from 'react'
import StaffProfilePage from './StaffProfile';
import ClientProfilePage from './ClientProfile';
import { useAuthUser } from '../../../app-context/user-context';
import cryptoHelper from '../../../Utils/crypto-helper';

const Profile = () => {

    const { authUser } = useAuthUser();
	const user = authUser();

	const display = () => user && cryptoHelper.decryptData(user.mode) === '0' ? <StaffProfilePage /> : <ClientProfilePage /> ;

	return ( <React.Fragment>{ display() }</React.Fragment> );
}

export default Profile;