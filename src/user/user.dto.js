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
        this.active = props.active;
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
        this.phone = props.phone;
        this.profileImage = props.profileImage;
        this.active = props.active;
        this.emailVerified = props.emailVerified;
        Object.freeze(this);
    }
}

class UpdateProfileRequestDTO {
    constructor( { ...props } ) {
        this.name = props.name;
        this.phone = props.phone;

        Object.keys(this).forEach( key => {
            if(this[key] === undefined) {
                delete this[key];
            }
        });
        Object.freeze(this);
    }
}

module.exports = {
    GetDTO,
    InsertDTO,
    LoginRequestDTO,
    LoginResponseDTO,
    RegisterRequestDTO,
    UpdateProfileRequestDTO,
};