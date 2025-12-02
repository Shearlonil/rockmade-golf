import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useContestController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const finById = async (signal, id) => {
        return await xhrAios.get(`/contests/search/${id}`, {signal});
    }
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/contests/active/all`, {signal});
    }
    
    const contestSearch = async (signal, data) => {
        return await xhrAios.get(`/contests/query`, {
            params: {
                str: data.inputValue, status: data.contestStatus
            }
        }, {signal});
    }
    
    const removeHole = async (signal, data) => {
        return await xhrAios.put(`/contests/hole/remove`, data, {signal});
    }

    const updateHoles = async (signal, data) => {
        return await xhrAios.put(`/contests/holes/update`, data, {signal});
    }

    const create = async (signal, name) => {
        return await xhrAios.post(`/contests/create/${name}`, {signal});
    }

    const update = async (signal, data) => {
        return await xhrAios.put(`/contests/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAios.put(`/contests/status`, data, {signal});
    }
    
    const activeContestsPageInit = async (signal, pageSize) => {
        return await xhrAios.get(`/contests/active/init/${pageSize}`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAios.get(`/contests/search/page/${data.page}`, {
            params: {
                pageSize: data.pageSize, status: data.contestStatus, page: data.page
            }
        }, {signal});
    }

    return {
        finById,
        fetchAllActive,
        removeHole,
        updateHoles,
        create,
        update,
        status,
        paginateFetch,
        activeContestsPageInit,
        contestSearch,
    }
}

export default useContestController;