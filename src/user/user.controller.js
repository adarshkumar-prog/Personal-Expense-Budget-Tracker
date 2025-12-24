const userService = require('./user.service');
const userDTO = require('./user.dto');
const autoBind = require('auto-bind');

class UserController {
    constructor( service ) {
        this.service = service;
        this.dto = userDTO;
        autoBind(this);
    }

    async register(req, res, next) {
        try {
            const registerData = new this.dto.RegisterRequestDTO({ ...req.body });
            const response = await this.service.register( registerData );
            response.data = new this.dto.GetDTO(response.data);
            return res.status(201).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res, next) {
        try {
            const loginData = new this.dto.LoginRequestDTO({ ...req.body });
            const response = await this.service.login( loginData );
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async savePushToken(req, res, next) {
        try {
            const userId = req.user.id;
            const { pushToken } = req.body;
            const response = await this.service.savePushToken( userId, pushToken );
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = req.user;
            const response = await this.service.getProfile( user );
            return res.status(200).json(new this.dto.GetDTO(response.data));
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async changePassword(req, res, next) {
        try {
            const user = req.user;
            const { oldPassword, newPassword } = req.body;
            const response = await this.service.changePassword( user, oldPassword, newPassword );
            return res.status(200).json(response.data.name + ' Your password has been changed successfully');
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    async requestPasswordReset(req, res, next) {
        try {
            const { email } = req.body;
            const { otp } = await this.service.requestPasswordReset( email );
            return res.status(200).json({ otp });
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, otp, newPassword } = req.body;
            const response = await this.service.resetPassword( email, otp, newPassword );
            return res.status(200).json(response.data.name + ' Your password has been reset successfully');
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    async checkLogin(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            if(authHeader && authHeader.startsWith('Bearer')) {
                const token = authHeader.split(' ')[1];
                req.user = await this.service.checkLogin( token );
                req.authorized = true;
                req.token = token;
                next();
            }
            else {
                req.authorized = false;
                next();
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async logout(req, res, next) {
        try {
            const response = await this.service.logout( req.token );
            return res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new UserController( userService );