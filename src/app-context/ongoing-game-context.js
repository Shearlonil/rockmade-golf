import { createContext, useContext, useMemo, useState } from "react";

const OngoingGameContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const GameProvider = ({ children }) => {
    const [ongoingRound, setOngoingRound] = useState(null);
    // scores (including contest scores, if any) for all players in the game. Players in the same group will be filtered from this array in GroupScore for display purposes
    const [playerScores, setPlayerScores] = useState([]);
    // all groups in the game
    const [gameGroups, setGameGroups] = useState([]);
    
    const ongoingGame = () => {
        return ongoingRound;
    };
    
    const setOngoingGame = (game) => {
        setOngoingRound(game);
    };
    
    const scores = () => {
        return playerScores;
    };
    
    const setScores = (playerScores) => {
        setPlayerScores(playerScores);
    };
    
    const groups = () => {
        return gameGroups;
    };
    
    const setGroups = (gameGroups) => {
        setGameGroups(gameGroups);
    };

    const value = useMemo(
        () => ({
            ongoingGame,
            setOngoingGame,
            scores,
            setScores,
            groups,
            setGroups,
        }),
        [ongoingRound, playerScores, gameGroups]
    );

    return <OngoingGameContext.Provider value={value}>{children}</OngoingGameContext.Provider>;
}

export const useOngoingRound = () => useContext(OngoingGameContext);