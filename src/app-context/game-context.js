import { createContext, useContext, useMemo, useState } from "react";

const GameRoundContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const GameProvider = ({ children }) => {
    const [playerOfInterest, setPlayerOfInterest] = useState(null);
    const [game, setGame] = useState(null);
    const [organizerOfGame, setOrganizerOfGame] = useState(null);
    // scores (including contest scores, if any) for all players in the game. Players in the same group will be filtered from this array in GroupScore for display purposes
    const [playerScores, setPlayerScores] = useState([]);
    // all groups in the game
    const [gameGroups, setGameGroups] = useState([]);
    // properties of all holes (hcp and par)
    const [allHoleProps, setAllHoleProps] = useState();

    const player_id = () => {
        return playerOfInterest;
    }

    const setPlayerID = (playerOfInterestID) => {
        setPlayerOfInterest(playerOfInterestID);
    }
    
    const gamePlay = () => {
        return game;
    };
    
    const setGamePlay = (game) => {
        setGame(game);
    };

    const gameOrganizer = () => {
        return organizerOfGame;
    }

    const setGameOrganizer = (organizer) => {
        setOrganizerOfGame(organizer)
    }
    
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
    
    const holeProps = () => {
        return allHoleProps;
    };
    
    const setHoleProps = (allHoleProps) => {
        setAllHoleProps(allHoleProps);
    };

    const value = useMemo(
        () => ({
            player_id, 
            setPlayerID,
            gamePlay,
            setGamePlay,
            gameOrganizer,
            setGameOrganizer,
            scores,
            setScores,
            groups,
            setGroups,
            holeProps,
            setHoleProps,
        }),
        [playerOfInterest, game, playerScores, gameGroups, allHoleProps, organizerOfGame]
    );

    return <GameRoundContext.Provider value={value}>{children}</GameRoundContext.Provider>;
}

export const useGame = () => useContext(GameRoundContext);