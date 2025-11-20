import httpService from "../axios/http-service";

const fetchAllActive = async (signal) => {
    return await httpService.get(`/contests/active/all`, {signal});
}

const getAxios = () => {
    return httpService.getAxios();
}

export default {
    fetchAllActive,
    getAxios,
}