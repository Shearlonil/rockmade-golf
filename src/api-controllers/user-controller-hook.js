import { useAxiosInterceptor } from '../axios/axios-interceptors';
import cryptoHelper from '../Utils/crypto-helper';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useUserController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const onboard = async (signal, data) => {
        let formData = new FormData();
        formData.append('fname', data.fname);
        formData.append('lname', data.lname);
        formData.append('email', data.email);
        formData.append('gender', data.sex.value);
        formData.append('hc_id', data.home_club.value.id);
        formData.append('country_id', data.country.value.id);
        formData.append('hcp', data.hcp);
        formData.append('otp', data.otp);
        formData.append('dob', data.dob);
        formData.append('pw', cryptoHelper.encrypt(data.pw));
        if(data.file){
            formData.append('img', data.file);
        }
        await xhrAios.post(`/users/onboarding`, formData, {signal})
    }
    
    const status = async (signal, data) => {
        return await xhrAios.put(`/users/status`, data, {signal});
    }
    
    const activeStaffPageInit = async (signal, pageSize) => {
        return await xhrAios.get(`/users/active/init/${pageSize}`, {signal});
    }
    
    const dashbaord = async (signal) => {
        return await xhrAios.get(`/users/dashboard`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAios.get(`/users/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.contestStatus, page: data.page
            }
        }, {signal});
    }
    
    const userSearch = async (signal, data) => {
        return await xhrAios.get(`/users/query`, {
            params: {
                str: data.inputValue, status: data.userStatus
            }
        }, {signal});
    }
    
    const gameUserSearch = async (signal, data) => {
        return await xhrAios.get(`/users/game/query`, {
            params: {
                str: data.inputValue
            }
        }, {signal});
    }

    return {
        onboard,
        status,
        activeStaffPageInit,
        dashbaord,
        paginateFetch,
        userSearch,
        gameUserSearch,
    }
}

export default useUserController;