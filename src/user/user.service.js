const mongoose = require('mongoose');
const userModel = require('./user.models');
const autoBind = require('auto-bind');


class UserService {
    constructor( userModel ) {
        this.userModel = userModel;
        autoBind(this);
    }

    async register( data ) {
        try {
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
                    return { 'data' : { 'token' : token }, 'message' : 'Login successful' };
                }
            } catch (error) {
                throw error;
            }
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
}

module.exports = new UserService( userModel );