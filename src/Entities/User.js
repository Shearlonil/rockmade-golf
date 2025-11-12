const _userProps = new WeakMap();

export default class User {
    constructor(decodedToken) {
        if (decodedToken) {
            const { whom } = decodedToken;
            _userProps.set(this, {
                id: whom.id,
                firstName: whom.fname,
                lastName: whom.lname,
                status: whom.status,
                email: whom.email,
                phone: whom.phone,
                sex: whom.sex,
                regDate: whom.regDate,
                hcp: whom.hcp,
                sub: whom.sub,
                roles: whom.roles, // specifies 'E' or 'S'. Not available for staff 
            });
        }
    }

    get id() { return _userProps.get(this).id }
    
    set id(id) { _userProps.get(this).id = id }

    get firstName() { return _userProps.get(this).firstName }
    
    set firstName(firstName) { _userProps.get(this).firstName = firstName }

    get lastName() { return _userProps.get(this).lastName }
    
    set lastName(lastName) { _userProps.get(this).lastName = lastName }

    get status() { return _userProps.get(this).status }
    
    set status(status) { _userProps.get(this).status = status }

    get sex() { return _userProps.get(this).sex }
    
    set sex(sex) { _userProps.get(this).sex = sex }

    get email() { return _userProps.get(this).email }
    
    set email(email) { _userProps.get(this).email = email }

    get sub() { return _userProps.get(this).sub }
    
    set sub(sub) { _userProps.get(this).sub = sub }

    get phone() { return _userProps.get(this).phone }
    
    set phone(phone) { _userProps.get(this).phone = phone }
    
    set accType(type) { _userProps.get(this).accType = type }

    get accType() { return _userProps.get(this).accType }

    get regDate() { return _userProps.get(this).regDate }
    
    set regDate(regDate) { _userProps.get(this).regDate = regDate }
    
    get authorities() {
        return auths();
    }

    hasAuth(authCode){
        return auths().includes(authCode);
    }
}

const auths = () => {
    if(_userProps.roles){
        //  split roles into arrays of authorities first
        return _userProps.roles.split(',');
    }
    return [];
}