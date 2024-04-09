const express = require('express');

const router = express.Router();
const authController = require('../app/controllers/auth.controller')
const userController = require('../app/controllers/user.controller')
const auth = require('../app/middleware/auth')

router.post('/login',  authController.login)
router.post('/verify-otp',  authController.verifyOtp)
router.post('/resend-otp',  authController.resendotp)
router.post('/register',  authController.register)
router.get('/logout',  authController.logout)
router.put('/edit', auth.expressAuthentication, userController.edit)

module.exports = router;