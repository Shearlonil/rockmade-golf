import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCountryController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/countries/active/all`, {signal});
    }
    
    const getAxios = () => {
        return xhrAios;
    }

    return {
        fetchAllActive,
        getAxios,
    }
}

export default useCountryController;