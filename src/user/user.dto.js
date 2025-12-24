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
        this.phone = props.phone;
        this.password = props.password;
        this.otp = props.otp;
        this.otpExpiry = props.otpExpiry;

        Object.keys(this).forEach( key => {
            if(this[key] === undefined) {
                delete this[key];
            }
        });
        Object.freeze(this);
    }
}

class GetDTO {
    constructor( { ...props } ) {
        this.id = props.id;
        this.email = props.email ? props.email.toLowerCase() : undefined;
        this.name = props.name;
        Object.freeze(this);
    }
}

module.exports = {
    InsertDTO,
    LoginRequestDTO,
    LoginResponseDTO,
    RegisterRequestDTO,
    GetDTO,
};