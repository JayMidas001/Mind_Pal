const express = require('express');
const { bookAppointment,  getPendingAppointmentsForUser } = require('../controllers/appointmentController');
const { userAuth } = require('../middlewares/auth');


const router = express.Router();



router.post('/book/:userId', userAuth, bookAppointment );

router.get('/getpendingappointments/:userId', getPendingAppointmentsForUser);



module.exports = router;
