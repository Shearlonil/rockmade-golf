import { format } from "date-fns";
import numeral from "numeral";

const _golfCourseProps = new WeakMap();

export class GolfCourse {
    constructor(jsonObject) {
        if (jsonObject) {
            const { id, name, no_of_holes, location, createdAt, status } = jsonObject;
            _golfCourseProps.set(this, {
                id, name, no_of_holes, createdAt, location, status
            });
        }else {
            _golfCourseProps.set(this, {});
        }
    }

    get id() { return _golfCourseProps.get(this).id; }
    set id(id) { _golfCourseProps.get(this).id = id }

    get name() { return _golfCourseProps.get(this).name; }
    set name(name) { _golfCourseProps.get(this).name = name }

    // get creator() { return _golfCourseProps.get(this).creator; }
    // set creator(creator) { _golfCourseProps.get(this).creator = creator }

    get noOfHoles() { return numeral(_golfCourseProps.get(this).no_of_holes).format('₦0,0.00') }
    set noOfHoles(balance) { _golfCourseProps.get(this).no_of_holes = balance }

    get location() { return _golfCourseProps.get(this).location; }
    set location(location) { _golfCourseProps.get(this).location = location }

    get status() { return _golfCourseProps.get(this).status; }
    set status(status) { _golfCourseProps.get(this).status = status }
    
    get createdAt() { return _golfCourseProps.get(this).createdAt ? format(_golfCourseProps.get(this).createdAt, 'dd/MM/yyyy HH:mm:ss') : ''; }
    set createdAt(createdAt) { _golfCourseProps.get(this).createdAt = createdAt }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            no_of_holes: this.no_of_holes,
            createdAt: this.createdAt,
            location: this.location,
            status: this.status,
            // creator: this.creator,
        }
    }
}