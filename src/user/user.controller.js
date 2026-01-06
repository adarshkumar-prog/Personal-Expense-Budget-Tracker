const userService = require("./user.service");
const userDTO = require("./user.dto");
const autoBind = require("auto-bind");

class UserController {
  constructor(service) {
    this.service = service;
    this.dto = userDTO;
    autoBind(this);
  }

  async register(req, res, next) {
    try {
      const registerData = new this.dto.RegisterRequestDTO({ ...req.body });
      const response = await this.service.register(registerData);
      response.data = new this.dto.GetDTO(response.data);
      return res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async login(req, res, next) {
    try {
      const loginData = new this.dto.LoginRequestDTO({ ...req.body });
      const response = await this.service.login(loginData);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyTwoFactorLogin(req, res, next) {
    try {
      const { temp2FAToken, otp } = req.body;
      const response = await this.service.verifyTwoFactorLogin(temp2FAToken, otp);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async enableTwoFactorAuth(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.enableTwoFactorAuth(user);
      return res.status(200).json(response.data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyTwoFactorAuth(req, res, next) {
    try {
      const user = req.user;
      const { otp } = req.body;
      const response = await this.service.verifyTwoFactorAuth(user, otp);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async disableTwoFactorAuth(req, res, next) {
    try {
      const user = req.user;
      const { otp } = req.body;
      const response = await this.service.disableTwoFactorAuth(user, otp);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (typeof refreshToken !== "string" || refreshToken.trim() === "") {
        throw new Error("Invalid refresh token");
      }
      const response = await this.service.refreshToken(refreshToken);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async savePushToken(req, res, next) {
    try {
      const userId = req.user.id;
      const { pushToken } = req.body;
      const response = await this.service.savePushToken(userId, pushToken);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.getProfile(user);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = req.user;
      const updateData = new this.dto.UpdateProfileRequestDTO({ ...req.body });
      const response = await this.service.updateProfile(user, updateData);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeEmailRequest(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.changeEmailRequest(user);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeEmail(req, res, next) {
    try {
      const user = req.user;
      const { newEmail, otp } = req.body;
      const response = await this.service.changeEmail(user, newEmail, otp);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req, res, next) {
    try {
      const user = req.user;
      const { oldPassword, newPassword } = req.body;
      const response = await this.service.changePassword(
        user,
        oldPassword,
        newPassword
      );
      return res
        .status(200)
        .json(
          response.data.name + " Your password has been changed successfully"
        );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const { otp } = await this.service.requestPasswordReset(email);
      return res.status(200).json({ otp });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      const response = await this.service.resetPassword(
        email,
        otp,
        newPassword
      );
      return res
        .status(200)
        .json(
          response.data.name + " Your password has been reset successfully"
        );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkLogin(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        req.user = await this.service.checkLogin(token);
        req.authorized = true;
        req.token = token;
        next();
      } else {
        req.authorized = false;
        next();
      }
    } catch (error) {
      switch (error.message) {
        case "UNAUTHORIZED_ERROR":
          return res.status(401).json({ message: error.message });

        case "FORBIDDEN":
          return res.status(403).json({ message: error.message });

        default:
          return res.status(400).json({ message: error.message });
      }
    }
  }

  async sendEmailOtp(req, res, next) {
    try {
      const { email } = req.body;
      const response = await this.service.sendEmailOtp(email);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { email, otp } = req.body;
      const response = await this.service.verifyEmail(email, otp);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async isActive(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.isActive(user);
      if (response) {
        next();
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deactivateAccount(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.deactivateAccount(user);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async activateAccount(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.activateAccount(user);
      return res.status(200).json(new this.dto.GetDTO(response.data));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const user = req.user;
      const response = await this.service.deleteAccount(user);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res, next) {
    try {
      const response = await this.service.logout(req.user);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async logoutAllDevices(req, res, next) {
    try {
      const userId = req.user.id;
      const response = await this.service.logoutAllDevices(userId);
      return res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController(userService);
