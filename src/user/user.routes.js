const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/2fa/login/verify', userController.verifyTwoFactorLogin);
router.post('/token/refresh', userController.refreshToken);
router.post('/push-token', userController.checkLogin, userController.isActive, userController.savePushToken);
router.delete('/logout',userController.checkLogin, userController.isActive, userController.logout);
router.delete('/logout-all', userController.checkLogin, userController.isActive, userController.logoutAllDevices);
router.post('/2fa/enable', userController.checkLogin, userController.isActive, userController.enableTwoFactorAuth);
router.post('/2fa/verify', userController.checkLogin, userController.isActive, userController.verifyTwoFactorAuth);
router.post('/2fa/disable', userController.checkLogin, userController.isActive, userController.disableTwoFactorAuth);
router.delete('/deleteAccount', userController.checkLogin, userController.isActive, userController.deleteAccount);
router.get('/getProfile', userController.checkLogin, userController.isActive, userController.getProfile);
router.patch('/updateProfile', userController.checkLogin, userController.isActive, userController.updateProfile);
router.patch('/deactivate', userController.checkLogin, userController.deactivateAccount);
router.patch('/activate', userController.checkLogin, userController.activateAccount);
router.post('/email/change-request', userController.checkLogin, userController.isActive, userController.changeEmailRequest);
router.post('/email/change', userController.checkLogin, userController.isActive, userController.changeEmail);
router.patch('/changePassword', userController.checkLogin, userController.isActive, userController.changePassword);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.post('/send-email-otp', userController.sendEmailOtp);
router.post('/verify-email', userController.verifyEmail);

module.exports = router;