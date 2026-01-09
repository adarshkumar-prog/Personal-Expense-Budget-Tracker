const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/config');
const jwtAccessKey = config.JWT_SECRET;
const jwtRefreshKey = config.JWT_REFRESH_SECRET;
const jwt2FASecret = config.JWT_2FA_SECRET;


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
    'profileImage': {
        'url': {
            type: String,
            default: null,
        },
        'publicId': {
            type: String,
            default: null,
        },
        'createdAt': {
            type: Date,
            default: null,
        },
    },
    'active' : {
        type: Boolean,
        enum: [true, false],
        default: true,
    },
    'tokenVersion': {
        type: Number,
        default: 0,
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
    'twoFactorEnabled': {
        type: Boolean,
        default: false,
    },
    'twoFactorSecret': {
        type: String,
        default: null,
    },
    'tempTwoFactorSecret': {
        type: String,
        default: null,
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

userSchema.statics.generateAccessToken = function( user ) {
    try {
        return jwt.sign( {
            id: user._id,
            email: user.email,
            name: user.name,
            tv: user.tokenVersion
        }, jwtAccessKey, { 'expiresIn': '1h' } );
    } catch (error) {
        throw error;
    }
}

userSchema.statics.generateRefreshToken = function( user ) {
    try {
        return jwt.sign( {
            id: user._id,
        }, jwtRefreshKey, { 'expiresIn': '7d' } );
    } catch (error) {
        throw error;
    }
}

userSchema.statics.generateTemp2FAToken = function( user ) {
    try {
        return jwt.sign( {
            id: user._id,
            type: '2fa'
        }, jwt2FASecret, { 'expiresIn': '5m' } );
    } catch (error) {
        throw error;
    }
}

userSchema.statics.verifyTemp2FAToken = function (token) {
    try {
        const decoded = jwt.verify(token, jwt2FASecret);
        if (decoded.type !== '2fa') {
            throw new Error('Invalid token type');
        }
        return decoded.id;
    } catch (error) {
        throw error;
    }
}

userSchema.statics.decodeAccessToken = async function( token ) {
    try {
        return jwt.verify( token, jwtAccessKey );
    } catch (error) {
        throw error;
    }
}

userSchema.statics.decodeRefreshToken = async function(token) {
    try {
        return jwt.verify(token, jwtRefreshKey);
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
