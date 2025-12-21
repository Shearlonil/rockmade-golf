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
                sex: whom.sex,
                mode: whom.mode,
                regDate: whom.regDate,
                hcp: whom.hcp,
                sub: whom.sub,
                blur: whom.blur,
                roles: whom.roles,
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

    get mode() { return _userProps.get(this).mode }
    
    set mode(mode) { _userProps.get(this).mode = mode }

    get sub() { return _userProps.get(this).sub }
    
    set sub(sub) { _userProps.get(this).sub = sub }

    get blur() { return _userProps.get(this).blur }
    
    set blur(blur) { _userProps.get(this).blur = blur }

    get hcp() { return _userProps.get(this).hcp }
    
    set hcp(hcp) { _userProps.get(this).hcp = hcp }

    get regDate() { return _userProps.get(this).regDate }
    
    set regDate(regDate) { _userProps.get(this).regDate = regDate }
    
    get authorities() {
        return auths(_userProps.get(this));
    }

    hasAuth(authCode){
        return auths(_userProps.get(this)).includes(authCode);
    }
}

const auths = (userProps) => {
    if(userProps.roles){
        return userProps.roles;
    }
    return [];
}