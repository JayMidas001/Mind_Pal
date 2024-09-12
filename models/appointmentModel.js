const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'therapist',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // Use a string to represent time, e.g., "16:00" for 4 PM
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'completed', 'canceled'],
        default: 'scheduled'
    }
},{timestamps: true});

const appointmentModel = mongoose.model('appointment', AppointmentSchema)

module.exports = appointmentModel
