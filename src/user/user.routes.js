const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/token/refresh', userController.refreshToken);
router.post('/push-token', userController.checkLogin, userController.savePushToken);
router.delete('/logout',userController.checkLogin, userController.logout);
router.get('/getProfile', userController.checkLogin, userController.getProfile);
router.patch('/updateProfile', userController.checkLogin, userController.updateProfile);
router.post('/email/change-request', userController.checkLogin, userController.changeEmailRequest);
router.post('/email/change', userController.checkLogin, userController.changeEmail);
router.patch('/changePassword', userController.checkLogin, userController.changePassword);
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.post('/send-email-otp', userController.sendEmailOtp);
router.post('/verify-email', userController.verifyEmail);

module.exports = router;