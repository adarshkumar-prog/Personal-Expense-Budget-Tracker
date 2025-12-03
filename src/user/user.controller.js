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
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const loginData = new this.dto.LoginRequestDTO({ ...req.body });
            const response = await this.service.login( loginData );
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new UserController( userService );