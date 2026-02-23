import { format } from "date-fns";
import numeral from "numeral";

const _userHoleScores = new WeakMap();
const _holePars = new WeakMap();
const _holeContests = new WeakMap();

export class UserScore {
    constructor() {
        _userHoleScores.set(this, {
            score: 0,
            scoreLessHcp: 0,
            txtScore: 'Score',
            lbParVal: Number.MAX_VALUE,
            name: '',
            hcp: '',
            group: '',
            position: null,
        });
        _holePars.set(this, {});
        _holeContests.set(this, {});
    }

    get id() { return _userHoleScores.get(this).id; }
    set id(id) { _userHoleScores.get(this).id = id }

    get name() { return _userHoleScores.get(this).name }
    set name(name) { _userHoleScores.get(this).name = name }

    get group() { return _userHoleScores.get(this).group }
    set group(group) { _userHoleScores.get(this).group = group }

    get ProfileImgKeyhash() { return _userHoleScores.get(this).ProfileImgKeyhash }
    set ProfileImgKeyhash(ProfileImgKeyhash) { _userHoleScores.get(this).ProfileImgKeyhash = ProfileImgKeyhash }

    get hcp() { return _userHoleScores.get(this).hcp }
    set hcp(hcp) { _userHoleScores.get(this).hcp = hcp }

    // for display purposes in a table
    get toParVal() { return _userHoleScores.get(this).toParVal }

    // position of player in leaderboards
    get position() { return _userHoleScores.get(this).position }
    set position(position) { _userHoleScores.get(this).position = position }

    // for leaderboards ranking
    get lbParVal() { return _userHoleScores.get(this).lbParVal }

    // total actual score without subtracting hcp
    get score() { return _userHoleScores.get(this).score; }
    // total score less hcp
    get scoreLessHcp() { return _userHoleScores.get(this).scoreLessHcp; }
    // score text column in leaderboards
    get txtScore() { return _userHoleScores.get(this).txtScore; }

    get 1() { return _userHoleScores.get(this)[1]; }

    get 2() { return _userHoleScores.get(this)[2]; }

    get 3() { return _userHoleScores.get(this)[3]; }

    get 4() { return _userHoleScores.get(this)[4]; }

    get 5() { return _userHoleScores.get(this)[5]; }

    get 6() { return _userHoleScores.get(this)[6]; }

    get 7() { return _userHoleScores.get(this)[7]; }

    get 8() { return _userHoleScores.get(this)[8]; }

    get 9() { return _userHoleScores.get(this)[9]; }

    get 10() { return _userHoleScores.get(this)[10]; }

    get 11() { return _userHoleScores.get(this)[11]; }

    get 12() { return _userHoleScores.get(this)[12]; }

    get 13() { return _userHoleScores.get(this)[13]; }

    get 14() { return _userHoleScores.get(this)[14]; }

    get 15() { return _userHoleScores.get(this)[15]; }

    get 16() { return _userHoleScores.get(this)[16]; }

    get 17() { return _userHoleScores.get(this)[17]; }

    get 18() { return _userHoleScores.get(this)[18]; }

    setHoleScore(hole_no, score){
        _userHoleScores.get(this)[hole_no] = score > 0 ? score : null;
        const toPar = calcToParVal(_userHoleScores.get(this), _holePars.get(this));
        _userHoleScores.get(this).lbParVal = toPar;
        if(toPar === 0){
            _userHoleScores.get(this).toParVal = 'E';
        }else {
            _userHoleScores.get(this).toParVal = toPar;
        }
    }

    setHolePar(hole_no, par){
        _holePars.get(this)[hole_no] = par;
    }

    setHoleContestScore(hole_no, score){
        _holeContests.get(this)[hole_no] = score;
    }

    getHoleContestScore(hole_no){
        return _holeContests.get(this)[hole_no] ? _holeContests.get(this)[hole_no] : '';
    }
}

//  private helper function to calculate purchase amount
const calcToParVal = (userHoleScores, holePars) => {
    let totalScores = 0;
    let totalPars = 0;
    for (let i = 1; i <= 18; i++) {
        if(userHoleScores[i] && userHoleScores[i] > 0){
            totalScores += userHoleScores[i];
            totalPars += holePars[i];
        }
    }

    userHoleScores.scoreLessHcp = totalScores - userHoleScores.hcp;
    userHoleScores.score = totalScores;
    return totalScores - totalPars;
}