import { useAxiosInterceptor } from '../axios/axios-interceptors';

// https://stackoverflow.com/questions/75319009/how-to-use-hooks-within-function-in-react-js
const useGameController = () => {
    const { xhrAios } = useAxiosInterceptor();

    const createGame = async (signal, data) => {
        return await xhrAios.post(`/games/create`, data, {signal});
    }

    const updateGame = async (signal, data) => {
        return await xhrAios.post(`/games/update`, data, {signal});
    }

    const updateGameContests = async (signal, data) => {
        return await xhrAios.post(`/games/contests/update`, data, {signal});
    }

    const findOngoingRoundById = async (signal, id) => {
        return await xhrAios.get(`/games/rounds/ongoing/${id}`,{signal});;
    }
    
    return {
        createGame,
        updateGame,
        updateGameContests,
        findOngoingRoundById,
    }
}

export default useGameController;