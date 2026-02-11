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

    const updateGroupScores = async (signal, id, data) => {
        return await xhrAios.post(`/games/rounds/ongoing/${id}/players/group/scores`, data, {signal});
    }

    const updateGroupContestScores = async (signal, id, data) => {
        return await xhrAios.post(`/games/rounds/ongoing/${id}/players/group/contest/scores`, data, {signal});
    }

    const removeOngoingGame = async (signal, id) => {
        return await xhrAios.post(`/games/${id}/remove`, {signal});
    }

    const updateGameSpices = async (signal, data) => {
        return await xhrAios.post(`/games/spices/update`, data, {signal});
    }

    const findOngoingRoundById = async (signal, id) => {
        return await xhrAios.get(`/games/rounds/ongoing/${id}`, {signal});
    }

    const addPlayers = async (signal, data) => {
        return await xhrAios.post(`/games/rounds/ongoing/${data.game_id}/players/add`, data, {signal});
    }
    
    return {
        createGame,
        updateGame,
        updateGroupScores,
        updateGroupContestScores,
        removeOngoingGame,
        updateGameSpices,
        findOngoingRoundById,
        addPlayers,
    }
}

export default useGameController;