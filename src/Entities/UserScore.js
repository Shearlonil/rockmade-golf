import { format } from "date-fns";
import numeral from "numeral";

const _userHoleScores = new WeakMap();
const _holePars = new WeakMap();

export class UserScore {
    constructor() {
        _userHoleScores.set(this, {});
        _holePars.set(this, {});
    }

    get id() { return _userHoleScores.get(this).id; }
    set id(id) { _userHoleScores.get(this).id = id }

    get name() { return _userHoleScores.get(this).name }
    set name(name) { _userHoleScores.get(this).name = name }

    get ProfileImgKeyhash() { return _userHoleScores.get(this).ProfileImgKeyhash }
    set ProfileImgKeyhash(ProfileImgKeyhash) { _userHoleScores.get(this).ProfileImgKeyhash = ProfileImgKeyhash }

    get hcp() { return _userHoleScores.get(this).hcp }
    set hcp(hcp) { _userHoleScores.get(this).hcp = hcp }

    // for display purposes in a table
    get toParVal() { return _userHoleScores.get(this).toParVal }

    // for leaderboards ranking
    get toParValue() { return _userHoleScores.get(this).toParValue }

    get 1() { return _userHoleScores.get(this)[1]; }
    // set 1(val) { golfCourseProps.get(this)[1] = val; }

    get 2() { return _userHoleScores.get(this)[2]; }
    // set 2(val) { golfCourseProps.get(this)[2] = val; }

    get 3() { return _userHoleScores.get(this)[3]; }
    // set 3(val) { golfCourseProps.get(this)[3] = val; }

    get 4() { return _userHoleScores.get(this)[4]; }
    // set 4(val) { golfCourseProps.get(this)[4] = val; }

    get 5() { return _userHoleScores.get(this)[5]; }
    // set 5(val) { golfCourseProps.get(this)[5] = val; }

    get 6() { return _userHoleScores.get(this)[6]; }
    // set 6(val) { golfCourseProps.get(this)[6] = val; }

    get 7() { return _userHoleScores.get(this)[7]; }
    // set 7(val) { golfCourseProps.get(this)[7] = val; }

    get 8() { return _userHoleScores.get(this)[8]; }
    // set 8(val) { golfCourseProps.get(this)[8] = val; }

    get 9() { return _userHoleScores.get(this)[9]; }
    // set 9(val) { golfCourseProps.get(this)[9] = val; }

    get 10() { return _userHoleScores.get(this)[10]; }
    // set 10(val) { golfCourseProps.get(this)[10] = val; }

    get 11() { return _userHoleScores.get(this)[11]; }
    // set 11(val) { golfCourseProps.get(this)[11] = val; }

    get 12() { return _userHoleScores.get(this)[12]; }
    // set 12(val) { golfCourseProps.get(this)[12] = val; }

    get 13() { return _userHoleScores.get(this)[13]; }
    // set 13(val) { golfCourseProps.get(this)[13] = val; }

    get 14() { return _userHoleScores.get(this)[14]; }
    // set 14(val) { golfCourseProps.get(this)[14] = val; }

    get 15() { return _userHoleScores.get(this)[15]; }
    // set 15(val) { golfCourseProps.get(this)[15] = val; }

    get 16() { return _userHoleScores.get(this)[16]; }
    // set 16(val) { golfCourseProps.get(this)[16] = val; }

    get 17() { return _userHoleScores.get(this)[17]; }
    // set 17(val) { golfCourseProps.get(this)[17] = val; }

    get 18() { return _userHoleScores.get(this)[18]; }
    // set 18(val) { golfCourseProps.get(this)[18] = val; }

    setHoleScore(hole_no, score){
        _userHoleScores.get(this)[hole_no] = score;
        const toPar = calcToParVal(_userHoleScores.get(this), _holePars.get(this));
        _userHoleScores.get(this).toParValue = toPar;
        if(toPar === 0){
            _userHoleScores.get(this).toParVal = 'E';
        }else {
            _userHoleScores.get(this).toParVal = toPar;
        }
    }

    setHolePar(hole_no, par){
        _holePars.get(this)[hole_no] = par;
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

    return totalScores - totalPars;
}