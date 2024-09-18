const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'therapist'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,   // Use a string to represent time, e.g., "16:00" for 4 PM
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const appointmentModel = mongoose.model('appointment', appointmentSchema)

module.exports = appointmentModel
