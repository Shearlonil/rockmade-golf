import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useCourseController = () => {
    const { xhrAios } = useAxiosInterceptor();
    
    const fetchAllActive = async (signal) => {
        return await xhrAios.get(`/courses/active/all`, {signal});
    }
    
    const createCourse = async (signal, data) => {
        return await xhrAios.post(`/courses/create`, data, {signal});
    }
    
    const getAxios = () => {
        return xhrAios;
    }

    return {
        fetchAllActive,
        createCourse,
        getAxios,
    }
}

export default useCourseController;