import { useAxiosInterceptor } from '../axios/axios-interceptors';
import cryptoHelper from '../Utils/crypto-helper';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useUserController = () => {
    const { xhrAxios } = useAxiosInterceptor();
    
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
        await xhrAxios.post(`/users/onboarding`, formData, {signal})
    }
    
    const updateHomeClub = async (signal, data) => {
        return await xhrAxios.put(`/users/profile/hc/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAxios.put(`/users/status`, data, {signal});
    }
    
    const updatePassword = async (signal, data) => {
        return await xhrAxios.put(`/users/profile/pw/update`, data, {signal});
    }
    
    const markEmailForUpdate = async (signal, data) => {
        return await xhrAxios.put(`/users/profile/email/update`, data, {signal});
    }
    
    const activeStaffPageInit = async (signal, pageSize) => {
        return await xhrAxios.get(`/users/active/init/${pageSize}`, {signal});
    }
    
    const playerInfo = async (signal, nano_id) => {
        return await xhrAxios.get(`/users/dashboard/games/player/${nano_id}`, {signal});
    }
    
    const playedCourses = async (signal, nano_id) => {
        return await xhrAxios.get(`/users/courses/played/${nano_id}`, {signal});
    }
    
    const dashboard = async (signal) => {
        return await xhrAxios.get(`/users/dashboard`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAxios.get(`/users/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.contestStatus, page: data.page
            }
        }, {signal});
    }

    // for use by players to search other players
    const playerSearch = async (signal, data) => {
        return await xhrAxios.get(`/users/players`, {
            params: {
                page_size: data.pageSize, cursor: data.cursor, hc: data.hc
            }
        }, {signal});
    }

    // for use by players to search other players
    const playerQryStrSearch = async (signal, data) => {
        return await xhrAxios.get(`/users/players/query`, {
            params: {
                page_size: data.pageSize, cursor: data.cursor, hc: data.hc, queryStr: data.queryStr, 
            }
        }, {signal});
    }
    
    // for use by admin to search players
    const userSearch = async (signal, data) => {
        return await xhrAxios.get(`/users/query`, {
            params: {
                str: data.inputValue, status: data.userStatus
            }
        }, {signal});
    }
    
    // search user to add to game
    const gameUserSearch = async (signal, data) => {
        return await xhrAxios.get(`/users/game/query`, {
            params: {
                str: data.inputValue
            }
        }, {signal});
    }
    
    const getAxios = () => xhrAxios;

    return {
        onboard,
        playedCourses,
        updateHomeClub,
        status,
        updatePassword,
        markEmailForUpdate,
        activeStaffPageInit,
        playerInfo,
        dashboard,
        paginateFetch,
        userSearch,
        playerSearch,
        playerQryStrSearch,
        gameUserSearch,
        getAxios,
    }
}

export default useUserController;