import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useContestController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/contests/active/all`, {signal});
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
        return await xhrAios.post(`/contests/status`, data, {signal});
    }

    return {
        fetchAllActive,
        removeHole,
        updateHoles,
        create,
        update,
        status,
    }
}

export default useContestController;