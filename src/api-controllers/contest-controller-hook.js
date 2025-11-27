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

    return {
        fetchAllActive,
        removeHole,
        updateHoles,
    }
}

export default useContestController;