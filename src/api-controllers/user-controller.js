import httpService from "../axios/http-service";
const getAxios = () => {
    return httpService.getAxios();
}

export default {
    getAxios,
}