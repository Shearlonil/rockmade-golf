import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCountryController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/countries/active/all`, {signal});
    }

    const create = async (signal, name) => {
        return await xhrAios.post(`/countries/create/${name}`, {signal});
    }

    const update = async (signal, data) => {
        return await xhrAios.put(`/countries/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAios.post(`/countries/status`, data, {signal});
    }

    return {
        fetchAllActive,
        create,
        update,
        status,
    }
}

export default useCountryController;