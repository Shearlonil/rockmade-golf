import httpService from "../axios/http-service";

const fetchAllActive = async () => {
    return await httpService.get(`/courses/active/all`);
}

const createCourse = async (data) => {
    return await httpService.post(`/courses/create`, data);
}

const getAxios = () => {
    return httpService.getAxios();
}

export default {
    fetchAllActive,
    createCourse,
    getAxios,
}