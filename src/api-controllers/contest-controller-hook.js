import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useContestController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/contests/active/all`, {signal});
    }
    
    const getAxios = () => {
        return xhrAios;
    }

    return {
        fetchAllActive,
        getAxios,
    }
}

export default useContestController;