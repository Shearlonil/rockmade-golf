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

    // changing a gruop a player belongs to
    const updatePlayerGroup = async (signal, data) => {
        return await xhrAios.put(`/games/rounds/ongoing/player/group/change`, data, {signal});
    }
    
    const updateGroupSize = async (signal, game_id, group_size) => {
        return await xhrAios.put(`/games/groups/update-size`, 
        {
            game_id, group_size
        }, 
        {signal});
    }
    
    const exchangeGroupPlayers = async (signal, data) => {
        return await xhrAios.put(`/games/groups/players/swap`, data, {signal});
    }

    const removePlayer = async (signal, data) => {
        return await xhrAios.put(`/games/rounds/ongoing/player/remove`, data, {signal});
    }
    
    const userRecentGames = async (signal, data) => {
        return await xhrAios.get(`/games/users/rounds/recent`, {
            params: {
                page_size: data.pageSize, cursor: data.game_group_id
            }
        }, {signal});
    }
    
    const userRecentGamesSearch = async (signal, data) => {
        return await xhrAios.get(`/games/users/rounds/recent/query`, {
            params: {
                page_size: data.pageSize, cursor: data.game_group_id, queryStr: data.queryStr
            }
        }, {signal});
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
        updatePlayerGroup,
        updateGroupSize,
        exchangeGroupPlayers,
        removePlayer,
        userRecentGames,
        userRecentGamesSearch,
    }
}

export default useGameController;