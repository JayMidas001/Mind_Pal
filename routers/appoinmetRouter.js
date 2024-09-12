const express = require('express');
const { createAppointment, getUserAppointments, getTherapistAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

const router = express.Router();



router.post('/appointments', createAppointment);
router.get('/appointments/:userId', getUserAppointments);
router.get('/appointments/:therapistId', getTherapistAppointments);
router.patch('/appointments/:appointmentId', updateAppointmentStatus);

module.exports = router;
