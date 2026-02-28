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

    const removegame = async (signal, id) => {
        return await xhrAios.post(`/games/${id}/remove`, {signal});
    }

    const updateGameSpices = async (signal, data) => {
        return await xhrAios.post(`/games/spices/update`, data, {signal});
    }

    const findRecentGameById = async (signal, id) => {
        return await xhrAios.get(`/games/rounds/recent/${id}`, {signal});
    }

    const findPlayerGameHistoryById = async (signal, data) => {
        return await xhrAios.get(`/games/rounds/history`, 
        {
            game_id: data.id,
            player_id: data.player_id
        }, {signal});
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
    
    const userGameHistory = async (signal, data) => {
        return await xhrAios.get(`/games/users/rounds/history`, {
            params: {
                page_size: data.pageSize, cursor: data.game_group_id, player_id: data.player_id
            }
        }, {signal});
    }
    
    const userGameHistorySearch = async (signal, data) => {
        return await xhrAios.get(`/games/users/rounds/history/query`, {
            params: {
                page_size: data.pageSize, cursor: data.game_group_id, queryStr: data.queryStr, player_id: data.player_id
            }
        }, {signal});
    }
    
    return {
        createGame,
        updateGame,
        updateGroupScores,
        updateGroupContestScores,
        removegame,
        updateGameSpices,
        findOngoingRoundById,
        findRecentGameById,
        findPlayerGameHistoryById,
        addPlayers,
        updatePlayerGroup,
        updateGroupSize,
        exchangeGroupPlayers,
        removePlayer,
        userGameHistory,
        userGameHistorySearch,
    }
}

export default useGameController;