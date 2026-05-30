import { UserScore } from "../Entities/UserScore";

export const buildHoleProps = (game) => {
    const obj = {};
    game.Course.holes.forEach(hole => {
        const hole_no = hole.hole_no;
        obj[hole_no] = {
            hcp_idx: hole.CourseHoles.hcp_idx,
            par: hole.CourseHoles.par,
        }
        // is contest attached to this hole for game play during game setup?
        const ghc = game.GameHoleContests.find(holeContest => holeContest.hole_id === hole.id);
        // if contest found
        if(ghc) {
            // get the contest (with details including the name) from course hole
            const contest = hole.contests.find(contest => contest.id === ghc.contest_id);
            if(contest){
                obj[hole_no].contest = {
                    id: contest.id,
                    name: contest.name,
                }
            }
        }
    });
    return obj;
};

export const buildGameScores = (game, holeProps, decrypted_id) => {
    const allScores = [];
    const groupsArr = [];
    let myGroup = '';
    game.users.forEach(user => {
        if(user.id == decrypted_id){
            myGroup = user.UserGameGroup.name;
        }
        if(user.UserGameGroup.round_no === game.current_round){
            const group = groupsArr.find(g => g.name === user.UserGameGroup.name);
            if(group){
                group.members.push(user);
            }else {
                groupsArr.push({
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
    
    let colsArr = [];
    switch (game.hole_mode) {
        case 1:
            colsArr = buildGroupScoreTableColumns(1, 18, allScores, holeProps);
            break;
        case 2:
            colsArr = buildGroupScoreTableColumns(1, 9, allScores, holeProps);
            break;
        case 3:
            colsArr = buildGroupScoreTableColumns(10, 18, allScores, holeProps);
            break;
    }

    const currentRoundScores = game.GameHoleRecords.filter(ghc => ghc.round_no === game.current_round);
    buildCurrentRoundScores(allScores, currentRoundScores);

    return { groupsArr, allScores, colsArr, myGroup };
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
    return arr;
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