const mongoose = require('mongoose');
const userModel = require('./user.models');
const userTokenModel = require('./user.userTokenModel');
const autoBind = require('auto-bind');


class UserService {
    constructor( userModel, userTokenModel ) {
        this.userModel = userModel;
        this.userTokenModel = userTokenModel;
        autoBind(this);
    }

    async register( data ) {
        try {
            const email = data.email;
            const { data: existingUser } = await this.findByEmail( email );
            if( existingUser ) {
                throw new Error('User with this email already exists');
            }
            const userData = await this.userModel.create( data );
            if( userData ) {
                return { 'data' : userData.toJSON(), 'message' : 'User registered successfully' };
            }
            throw new Error('User registration failed');
        } catch (error) {
            throw error;
        }
    }

    async login( loginDTO ) {
        const { email, password } = loginDTO;
        const { data } = await this.findByEmail( email, true );
        const user = data;
        if( !user ) {
            throw new Error('User not found');
        } else {
            try {
                const passwordMatch = await user.comparePassword( password );
                if( !passwordMatch ) {
                    throw new Error('Invalid password');
                } else {
                    const token = await this.userModel.generateToken( user );
                    await this.userTokenModel.create({ token, userId: user._id });
                    return { 'data' : { 'token' : token }, 'message' : 'Login successful' };
                }
            } catch (error) {
                throw error;
            }
        }
    }

    async getProfile( user ) {
        try {
            const userData = await this.userModel.findById( user.id );
            if( !userData ) {
                throw new Error('User not found');
            }
            return { 'data' : userData.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async requestPasswordReset( email ) {
        try {
            const { data } = await this.findByEmail( email );
            console.log(data);
            if( !data ) {
                throw new Error('User not found');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
            data.otp = otp;
            data.otpExpiry = otpExpiry;
            await data.save();
            console.log('data after saving otp', data);
            return { otp: data.otp };
        } catch( error ) {
            throw error;
        }
    }

    async resetPassword( email, otp, newPassword ) {
        try {
            const { data } = await this.findByEmail( email, true );
            if( !data ) {
                throw new Error('User not found');
            }
            if( data.otp !== otp ) {
                throw new Error('Invalid OTP');
            }
            if( data.otpExpiry < new Date() ) {
                throw new Error('OTP has expired');
            }
            data.password = newPassword;
            data.otp = undefined;
            data.otpExpiry = undefined;
            await data.save();
            return { 'data' : data.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async changePassword( user, oldPassword, newPassword ) {
        try {
            const userData = await this.userModel.findById( user.id ).select('+password');
            if( !userData ) {
                throw new Error('User not found');
            }
            const isMatch = await userData.comparePassword( oldPassword );
            if( !isMatch ) {
                throw new Error('Old password is incorrect');
            }
            userData.password = newPassword;
            await userData.save();
            return { 'data' : userData.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async findByEmail( email, includePassword = false ) {
        try {
            let data;
            if(includePassword) {
                data = await this.userModel.findOne({ email: email }).select('+password');
            }
            else {
                data = await this.userModel.findOne({ email: email });
            }
            return { data };
        } catch (error) {
            throw error;
        }
    }

    async checkLogin( token ) {
        try {
            const tokenInDB = await this.userTokenModel.countDocuments({ token: token });
            if( !tokenInDB ) {
                throw new Error('Invalid token');
            }
            const user = await this.userModel.decodeToken( token );
            if(!user) {
                throw new Error('UNAUTHORIZED_ERROR');
            }
            const tokenData = await this.userTokenModel.findOne({ token: token });
            if(tokenData.userId.toString() !== user.id) {
                throw new Error('UNAUTHORIZED_ERROR');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async logout(token) {
        try {
            const tokenData = await this.userTokenModel.findOneAndDelete({ token: token });
            const user  = await this.userModel.find({ _id: tokenData.userId });
            return { 'data' : user, 'message' : 'Logout successful' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService( userModel, userTokenModel );