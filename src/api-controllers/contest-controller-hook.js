import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useContestController = () => {
    const { xhrAxios } = useAxiosInterceptor();
    
    const finById = async (signal, id) => {
        return await xhrAxios.get(`/contests/search/${id}`, {signal});
    }
    
    const fetchAllActive = async (signal) => {
        return await xhrAxios.get(`/contests/active/all`, {signal});
    }
    
    const contestSearch = async (signal, data) => {
        return await xhrAxios.get(`/contests/query`, {
            params: {
                str: data.inputValue, status: data.contestStatus
            }
        }, {signal});
    }
    
    const removeHole = async (signal, data) => {
        return await xhrAxios.put(`/contests/hole/remove`, data, {signal});
    }

    const updateHoles = async (signal, data) => {
        return await xhrAxios.put(`/contests/holes/update`, data, {signal});
    }

    const create = async (signal, name) => {
        return await xhrAxios.post(`/contests/create/${name}`, {signal});
    }

    const update = async (signal, data) => {
        return await xhrAxios.put(`/contests/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAxios.put(`/contests/status`, data, {signal});
    }
    
    const activeContestsPageInit = async (signal, pageSize) => {
        return await xhrAxios.get(`/contests/active/init/${pageSize}`, {signal});
    }
    
    const paginateFetch = async (signal, data) => {
        return await xhrAxios.get(`/contests/search/page/${data.page}`, {
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