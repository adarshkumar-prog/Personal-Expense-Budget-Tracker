class InsertDTO {
    constructor( { ...props } ) {
        this.email = props.email;
        this.username = props.username;
        this.password = props.password;
    }
}

class LoginRequestDTO {
    constructor( { ...props } ) {
        this.email = props.email ? props.email.toLowerCase() : undefined;
        this.password = props.password;
        Object.freeze(this);
    }
}

class LoginResponseDTO {
    constructor( { ...props } ) {
        this.token = props.token;
        this.user = props.user;
        Object.freeze(this);
    }
}

class RegisterRequestDTO {
    constructor(  { ...props } ) {
        this.email = props.email ? props.email.toLowerCase() : undefined;
        this.name = props.name;
        this.password = props.password;

        Object.keys(this).forEach( key => {
            if(this[key] === undefined) {
                delete this[key];
            }
        });
        Object.freeze(this);
    }
}

module.exports = {
    InsertDTO,
    LoginRequestDTO,
    LoginResponseDTO,
    RegisterRequestDTO,
};