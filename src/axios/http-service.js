import axios from "axios";
import AppConstants from "../Utils/AppConstants";

/*
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            isAccepted: true
        }
    }

    const data = {
        data: 'whatever'
    }

    axios.post(url, data, config)
*/

axios.defaults.baseURL = "http://localhost:2025";
// axios.defaults.baseURL = "https://www.tapafricanow.com";
// axios.defaults.baseURL = "http://192.168.0.163:5173";
// axios.defaults.baseURL = "http://192.168.88.59:8082";

// ref: https://stackoverflow.com/questions/43002444/make-axios-send-cookies-in-its-requests-automatically
axios.defaults.withCredentials = true;

axios.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
        try {
            const response = await axios.get("/auth/refresh");
            //  remove the token prefix from the token for jwtDecode to decode the token
            const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
            localStorage.setItem(AppConstants.jwtStorageTitle, jwt);
            return await axios.request(originalRequest); // Retry the original request with the new access token.
        } catch (ex) {
            await axios.get("/auth/logout");
            localStorage.setItem(AppConstants.jwtStorageTitle, null);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(AppConstants.jwtStorageTitle);
    config.headers.authorization = token ? `Bearer ${token}` : "";
    config.headers['X-TENANT-ID'] = 'inventree';
    return config;
});

/*  configure axios with different baseUrl.
    ref:    https://stackoverflow.com/questions/47477594/how-to-use-2-instances-of-axios-with-different-baseurl-in-the-same-app-vue-js*/
const printerAxios = axios.create({
    baseURL: localStorage.getItem(AppConstants.printerURL)
    // baseURL: 'http://localhost:8084'
    // baseURL: 'http://192.168.0.102:8084'
});


function baseURL() {
    return axios.defaults.baseURL;
}

//  convert a string url to axios get. Useful when trying to perform axios.all request
function getMapping(urls) {
    return urls.map((url) => axios.get(url));
}

//  convert a string url to axios post. Useful when trying to perform axios.all request
function postMapping(urls, data) {
    return urls.map((url) => axios.post(url, data));
}

//  convert a string url to axios put. Useful when trying to perform axios.all request
function putMapping(urls, withCatch = true) {
    return urls.map((url) => axios.put(url));
}

function download(url) {
    return axios.get(url, {
        responseType: "blob",
    });
}

function getAxios(){
    return axios;
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    all: axios.all,
    getMapping,
    putMapping,
    postMapping,
    download,
    baseURL,
    getAxios,
    printerAxios,
};
