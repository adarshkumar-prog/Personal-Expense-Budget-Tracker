const mongoose = require("mongoose");
const userModel = require("./user.models");
const userTokenModel = require("./user.userTokenModel");
const expenseModel = require("../expense/expense.model");
const { sendSMS } = require("../notification/index");
const { sendOtpEmail } = require("../email/index");
const autoBind = require("auto-bind");

class UserService {
  constructor(userModel, userTokenModel, expenseModel, sendSMS, sendOtpEmail) {
    this.userModel = userModel;
    this.userTokenModel = userTokenModel;
    this.expenseModel = expenseModel;
    this.sendSMS = sendSMS;
    this.sendOtpEmail = sendOtpEmail;
    autoBind(this);
  }

  async register(data) {
    try {
      const email = data.email;
      const { data: existingUser } = await this.findByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      const phoneExistingUser = await this.userModel.findOne({
        phone: data.phone,
      });
      if (phoneExistingUser) {
        throw new Error("User with this phone number already exists");
      }
      const userData = await this.userModel.create(data);
      if (userData) {
        return {
          data: userData.toJSON(),
          message: "User registered successfully",
        };
      }
      throw new Error("User registration failed");
    } catch (error) {
      throw error;
    }
  }

  async login(loginDTO) {
    const { email, password } = loginDTO;
    const { data } = await this.findByEmail(email, true);
    const user = data;
    if (!user) {
      throw new Error("User not found");
    } else {
      try {
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
          throw new Error("Invalid password");
        } else {
          user.tokenVersion += 1;
          await user.save();
          const accessToken = await this.userModel.generateAccessToken(user);
          const refreshToken = await this.userModel.generateRefreshToken(user);
          await this.userTokenModel.deleteMany({ userId: user._id });
          await this.userTokenModel.create({
            token: refreshToken,
            userId: user._id,
          });
          return {
            data: { accessToken: accessToken, refreshToken: refreshToken },
            message: "Login successful",
          };
        }
      } catch (error) {
        throw error;
      }
    }
  }

async refreshToken(refreshToken) {
  try {
    const decoded = await this.userModel.decodeRefreshToken(refreshToken);
    const tokenDoc = await this.userTokenModel.findOne({
      token: refreshToken,
      userId: decoded.id,
    });

    if (!tokenDoc) {
      throw new Error("REFRESH_TOKEN_REUSED_OR_INVALID");
    }

    if (tokenDoc.expiresAt < new Date()) {
      await this.userTokenModel.deleteMany({ userId: decoded.id });
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    const user = await this.userModel.findById(decoded.id);

    if (!user) {
      await this.userTokenModel.deleteMany({ userId: decoded.id });
      throw new Error("USER_NOT_FOUND");
    }

    if (user.isActive === false) {
      throw new Error("ACCOUNT_DEACTIVATED");
    }
    const newAccessToken = this.userModel.generateAccessToken(user);
    const newRefreshToken = this.userModel.generateRefreshToken(user);

    await this.userTokenModel.updateOne(
      { _id: tokenDoc._id },
      {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    );

    return {
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      message: "Token refreshed successfully",
    };
  } catch (error) {
    throw error;
  }
}

  async savePushToken(userId, pushToken) {
    try {
      const userData = await this.userModel.findById(userId);
      if (!userData) {
        throw new Error("User not found");
      }
      userData.expoPushToken = pushToken;
      await userData.save();
      return {
        data: userData.toJSON(),
        message: "Push token saved successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(user) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      return { data: userData.toJSON() };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(user, updateData) {
    try {
      const userData = await this.userModel.findByIdAndUpdate(
        user.id,
        updateData,
        { new: true }
      );
      if (!userData) {
        throw new Error("User not found");
      }
      return {
        data: userData.toJSON(),
        message: "Profile updated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async changeEmailRequest(user) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      const email = userData.email;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
      userData.emailVerificationOtp = otp;
      userData.emailVerificationOtpExpiry = otpExpiry;
      await userData.save();
      await sendOtpEmail(email, otp);
      return { otp: userData.emailVerificationOtp };
    } catch (error) {
      throw error;
    }
  }

  async changeEmail(user, newEmail, otp) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      const existingEmailUser = await this.userModel.findOne({
        email: newEmail,
      });
      if (existingEmailUser) {
        throw new Error("Email is already in use");
      }
      if (userData.emailVerificationOtp !== otp) {
        throw new Error("Invalid OTP");
      }
      if (userData.emailVerificationOtpExpiry < new Date()) {
        throw new Error("OTP has expired");
      }
      userData.email = newEmail;
      userData.emailVerified = true;
      userData.emailVerificationOtp = null;
      userData.emailVerificationOtpExpiry = null;
      await userData.save();
      return { data: userData.toJSON(), message: "Email changed successfully" };
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      const { data } = await this.findByEmail(email);
      if (!data) {
        throw new Error("User not found");
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
      data.otp = otp;
      data.otpExpiry = otpExpiry;
      await data.save();
      await sendSMS(
        `+91${data.phone}`,
        `Your password reset OTP is: ${otp}. It is valid for 15 minutes.`
      );
      return { otp: data.otp };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      const { data } = await this.findByEmail(email, true);
      if (!data) {
        throw new Error("User not found");
      }
      if (data.otp !== otp) {
        throw new Error("Invalid OTP");
      }
      if (data.otpExpiry < new Date()) {
        throw new Error("OTP has expired");
      }
      data.password = newPassword;
      data.otp = undefined;
      data.otpExpiry = undefined;
      await sendSMS(
        `+91${data.phone}`,
        `Your password has been successfully reset.`
      );
      await data.save();
      return { data: data.toJSON() };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(user, oldPassword, newPassword) {
    try {
      const userData = await this.userModel
        .findById(user.id)
        .select("+password");
      if (!userData) {
        throw new Error("User not found");
      }
      const isMatch = await userData.comparePassword(oldPassword);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }
      userData.password = newPassword;
      await userData.save();
      await sendSMS(
        `+91${userData.phone}`,
        `Your password has been successfully changed.`
      );
      return { data: userData.toJSON() };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email, includePassword = false) {
    try {
      let data;
      if (includePassword) {
        data = await this.userModel
          .findOne({ email: email })
          .select("+password");
      } else {
        data = await this.userModel.findOne({ email: email });
      }
      return { data };
    } catch (error) {
      throw error;
    }
  }

  async checkLogin(token) {
    try {
      const user = await this.userModel.decodeAccessToken(token);
      if (!user) {
        throw new Error("UNAUTHORIZED_ERROR");
      }
      const userInDB = await this.userModel.findById(user.id);
      if (!userInDB) {
        throw new Error("UNAUTHORIZED_ERROR");
      }
      if (user.tv !== userInDB.tokenVersion) {
        throw new Error("UNAUTHORIZED_ERROR");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async sendEmailOtp(email) {
    try {
      const { data } = await this.findByEmail(email);
      if (!data) {
        throw new Error("User not found");
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
      data.emailVerificationOtp = otp;
      data.emailVerificationOtpExpiry = otpExpiry;
      await data.save();
      await sendOtpEmail(data.email, otp);
      return { message: "OTP has been sent to your emailId" };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(email, otp) {
    try {
      const { data } = await this.findByEmail(email);
      if (!data) {
        throw new Error("User not found");
      }
      if (data.emailVerified) {
        throw new Error("Email already verified");
      }
      if (data.emailVerificationOtp !== otp) {
        throw new Error("Invalid OTP");
      }
      if (data.emailVerificationOtpExpiry < new Date()) {
        throw new Error("OTP has expired");
      }
      data.emailVerified = true;
      data.emailVerificationOtp = null;
      data.emailVerificationOtpExpiry = null;
      await data.save();
      return { message: "Email verified successfully" };
    } catch (error) {
      throw error;
    }
  }

  async isActive(user) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      if (!userData.active) {
        throw new Error("Account is deactivated");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deactivateAccount(user) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      if (!userData.active) {
        throw new Error("Account is already deactivated");
      }
      userData.active = false;
      await userData.save();
      return {
        data: userData.toJSON(),
        message: "Account deactivated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async activateAccount(user) {
    try {
      const userData = await this.userModel.findById(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      if (userData.active) {
        throw new Error("Account is already active");
      }
      userData.active = true;
      await userData.save();
      return {
        data: userData.toJSON(),
        message: "Account activated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAccount(user) {
    try {
      const userData = await this.userModel.findByIdAndDelete(user.id);
      if (!userData) {
        throw new Error("User not found");
      }
      await this.userTokenModel.deleteMany({ userId: user.id });
      await this.expenseModel.deleteMany({ userId: user.id });
      return { message: "Account deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async logout(user) {
    try {
      const userInDB = await this.userModel.findById(user.id);
      if (!userInDB) {
        throw new Error("User not found");
      }
      userInDB.tokenVersion += 1;
      await userInDB.save();
      return { data: userInDB.toJSON(), message: "Logout successful" };
    } catch (error) {
      throw error;
    }
  }

  async logoutAllDevices(userId) {
    try {
      await this.userTokenModel.deleteMany({ userId: userId });
      const userInDB = await this.userModel.findById(userId);
      if (!userInDB) {
        throw new Error("User not found");
      }
      userInDB.tokenVersion += 1;
      await userInDB.save();
      return { message: "Logged out from all devices successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService(
  userModel,
  userTokenModel,
  expenseModel,
  { sendSMS },
  { sendOtpEmail }
);
