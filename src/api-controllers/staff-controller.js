import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useStaffController = () => {
    const { xhrAios } = useAxiosInterceptor();

    const register = async (signal, data) => {
        return await xhrAios.post('/staff/register', data, {signal});
    }
    
    const updatePassword = async (signal, data) => {
        return await xhrAios.put(`/staff/profile/pw/update`, data, {signal});
    }
    
    const dashboard = async (signal) => {
        return await xhrAios.get(`/staff/dashboard`, {signal});
    }

    const findByIdWithAuths = async (signal, id) => {
        return await xhrAios.get(`/staff/profile/search/${id}`, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAios.put(`/staff/status`, data, {signal});
    }
    
    const activeStaffPageInit = async (signal, pageSize) => {
        return await xhrAios.get(`/staff/active/init/${pageSize}`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAios.get(`/staff/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.userStatus, page: data.page
            }
        }, {signal});
    }
    
    const staffSearch = async (signal, data) => {
        return await xhrAios.get(`/staff/query`, {
            params: {
                str: data.inputValue, status: data.userStatus
            }
        }, {signal});
    }

    const updateRoles = async (signal, data) => {
        return await xhrAios.put('/staff/roles/update', data, {signal});
    }

    // get authorities to use in registering new users
    const getAuths = async (signal) => {
        return await xhrAios.get(`/staff/auths`, {signal});
    }

    return {
        register,
        updatePassword,
        dashboard,
        findByIdWithAuths,
        status,
        activeStaffPageInit,
        paginateFetch,
        staffSearch,
        updateRoles,
        getAuths,
    }
}

export default useStaffController;