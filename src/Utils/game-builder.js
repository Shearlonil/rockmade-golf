
export const buildGameScores = (game, holeProps) => {
    const decrypted_id = cryptoHelper.decryptData(user.id);
    const allScores = [];
    const arr = [];
    game.users.forEach(user => {
        if(user.id == decrypted_id){
            setMyGroup(user.UserGameGroup.name);
        }
        if(user.UserGameGroup.round_no === game.current_round){
            const group = arr.find(g => g.name === user.UserGameGroup.name);
            if(group){
                group.members.push(user);
            }else {
                arr.push({
                    name: user.UserGameGroup.name,
                    members: [user]
                });
            }
        }
        const userScore = new UserScore();
        userScore.id = user.id;
        userScore.nano_id = user.nano_id;
        userScore.hcp = user.UserGameGroup.user_hcp;
        userScore.ProfileImgKeyhash = user.ProfileImgKeyhash;
        userScore.name = user.fname + ' ' + user.lname;
        userScore.group = user.UserGameGroup.name;
        userScore.hole_mode = game.hole_mode;
        allScores.push(userScore);
    });
    switch (game.hole_mode) {
        case 1:
            buildGroupScoreTableColumns(1, 18, allScores, holeProps);
            break;
        case 2:
            buildGroupScoreTableColumns(1, 9, allScores, holeProps);
            break;
        case 3:
            buildGroupScoreTableColumns(10, 18, allScores, holeProps);
            break;
    }

    const currentRoundScores = game.GameHoleRecords.filter(ghc => ghc.round_no === game.current_round);
    buildCurrentRoundScores(allScores, currentRoundScores);
    setGroups(arr);
    setScores(allScores);
};

const buildGroupScoreTableColumns = (start, end, allScores, holeProps) => {
    const arr = [];
    for(let i = start; i <= end; i++){
        arr.push({
            key: i,
            label: i,
            width: 70,
        });
        allScores.forEach(groupScore => groupScore.setHolePar(i, holeProps[i].par) );
    }
    setColumns([...cols, ...arr]);
};

const buildCurrentRoundScores = (allScores, gameHoleRec) => {
    gameHoleRec.forEach(ghc => {
        ghc.UserHoleScores.forEach(uhs => {
            const found = allScores.find(gs => gs.id === uhs.user_id);
            if(found){
                const hole_no = ghc.hole_no;
                // found[hole_no] = uhs.score;
                found.setHoleScore(hole_no, uhs.score);
            }
        });
        ghc.UserHoleContestScores.forEach(uhcs => {
            const found = allScores.find(gs => gs.id === uhcs.user_id);
            if(found){
                const hole_no = ghc.hole_no;
                found.setHoleContestScore(hole_no, uhcs.score);
            }
        });
    });
};