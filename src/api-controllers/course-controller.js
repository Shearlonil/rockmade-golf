import httpService from "../axios/http-service";

const fetchAllActive = async (signal) => {
    return await httpService.get(`/courses/active/all`, {signal});
}

const createCourse = async (signal, data) => {
    return await httpService.post(`/courses/create`, data, {signal});
}

const getAxios = () => {
    return httpService.getAxios();
}

export default {
    fetchAllActive,
    createCourse,
    getAxios,
}