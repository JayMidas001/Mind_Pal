const express = require('express');
const { bookAppointment,  getPendingAppointmentsForUser } = require('../controllers/appointmentController');

const router = express.Router();



router.post('/book/:userId',bookAppointment );

router.get('/getpendingappointments/:userId', getPendingAppointmentsForUser);



module.exports = router;
