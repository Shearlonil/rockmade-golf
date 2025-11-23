import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useGameController = () => {
    const { xhrAios } = useAxiosInterceptor();

    const createGame = async (signal, data) => {
        return await xhrAios.post(`/games/create`, data, {signal});
    }

    const getAxios = () => {
        return xhrAios;
    }
    
    return {
        createGame,
        getAxios,
    }
}

export default useGameController;