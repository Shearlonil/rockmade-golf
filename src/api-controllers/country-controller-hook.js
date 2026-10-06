import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCountryController = () => {
    const { xhrAxios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAxios.get(`/countries/active/all`, {signal});
    }

    const create = async (signal, name) => {
        return await xhrAxios.post(`/countries/create/${name}`, {signal});
    }

    const update = async (signal, data) => {
        return await xhrAxios.put(`/countries/update`, data, {signal});
    }
    
    const status = async (signal, data) => {
        return await xhrAxios.post(`/countries/status`, data, {signal});
    }

    return {
        fetchAllActive,
        create,
        update,
        status,
    }
}

export default useCountryController;