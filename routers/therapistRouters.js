const express = require('express')

require('../controllers/therapistController')

const upload = require('../utils/multer')
const { signUpTherapist, verifyEmail, logInTherapist, resendVerificationEmail, forgotPassword, changePassword, resetPassword, getOneTherapist, getAllTherapists, updateTherapist, deleteTherapist, logOutTherapist } = require('../controllers/therapistController')
const { validationSignUp, validationLogIn, validationEmail, validationPassword, validationUpdate } = require('../middlewares/therapistValidator')
const authorize = require('../middlewares/auth')


const router = express.Router()

router.post('/sign-up',upload.fields([
    { name: 'certificate', maxCount: 3 },
    { name: 'idCard', maxCount: 2 },
  ]), validationSignUp, signUpTherapist)

router.get('/verify/:token', verifyEmail)

router.post('/log-in',validationLogIn, logInTherapist)

router.post(`/resend-verification`,validationEmail, resendVerificationEmail)

router.post(`/forgot-password`,validationEmail, forgotPassword)

router.post(`/change-password/:token`,validationPassword, changePassword)

router.post(`/reset-password/:token`, resetPassword)

router.get('/one/:therapistId', getOneTherapist)

router.get('/all', getAllTherapists)

router.put('/update/:therapistId', upload.single('photo'),validationUpdate, updateTherapist)

router.delete('/delete/:id',authorize, deleteTherapist)

router.post("/log-out", logOutTherapist)

module.exports = router