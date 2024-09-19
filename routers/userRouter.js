const express = require("express")
const upload = require("../utils/multer")

const { signUp, loginUser, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getAll, getOne, deleteUser, makeAdmin, logOut, updateUser } = require("../controllers/userController")

const router = express.Router()

const { validationSignUp, validationLogIn, validationEmail, validationPassword, validationUpdate } = require("../middlewares/validator")

const authorize = require("../middlewares/auth")


router.post("/sign-up",validationSignUp, signUp)

router.post("/log-in",validationLogIn, loginUser)

router.get('/verify/:token', verifyEmail)

router.post('/resend-verification',validationEmail, resendVerificationEmail)

router.post('/forgot-password',validationEmail, forgotPassword)

router.post('/change-password/:token',validationPassword, changePassword)

router.post('/reset-password/:token', resetPassword)

router.put("/update-user/:userId",upload.single('image'), validationUpdate, updateUser)

router.get('/getall',authorize, getAll)

router.get('/getone/:userId', getOne)

router.delete('/delete/:userId',authorize, deleteUser)

router.get('/makeadmin/:userId',authorize, makeAdmin)

router.post("/log-out", logOut)

module.exports = router