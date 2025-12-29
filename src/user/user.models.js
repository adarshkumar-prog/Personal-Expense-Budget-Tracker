const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/config');
const jwtKey = config.JWT_SECRET;


const userSchema = new Schema({
    'name': {
        type: String,
        required: true,
    },
    'email': {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    'password': {
        type: String,
        required: true,
    },
    'phone' : {
        type: String,
        required: true,
        unique: true,
    },
    'otp': {
        type: String,
    },
    'otpExpiry': {
        type: Date,
    },
    'expoPushToken': {
        type: String,
    },
    'emailVerified': {
        type: Boolean,
        default: false,
    },
    'emailVerificationOtp': {
        type: String,
        default: null,
    },
    'emailVerificationOtpExpiry': {
        type: Date,
        default: null,
    },
}, { 'timestamps': true });

userSchema.statics.generateToken = async function( user ) {
    try {
        return await jwt.sign( {
            id: user._id,
            email: user.email,
            name: user.name,
        }, jwtKey, { 'expiresIn': '1d' } );
    } catch (error) {
        throw error;
    }
}

userSchema.statics.decodeToken = async function( token ) {
    try {
        return await jwt.verify( token, jwtKey );
    } catch (error) {
        throw error;
    }
}

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
