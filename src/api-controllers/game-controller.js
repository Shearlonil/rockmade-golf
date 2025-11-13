import httpService from "../axios/http-service";

const createGame = async (data) => {
    return await httpService.post(`/api/customers/create`, data);
}

const getAxios = () => {
    return httpService.getAxios();
}

export default {
    createGame,
    getAxios,
}