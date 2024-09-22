const appointmentModel = require("../models/appointmentModel");
require("dotenv").config();
const mongoose = require(`mongoose`);
const userModel = require("../models/userModel");
const therapistModel = require("../models/therapistModel");
const { sendMail } = require("../helpers/email");
const html = require(`../helpers/html`);

exports.bookAppointment = async (req, res) => {
  try {
    // const { userId } = req.user;
    const { userId } = req.params;
    const { therapistId, date, time } = req.body;

    // Check if the appointment date is in the future
    const appointmentDate = new Date(date);
    const currentDate = new Date();

    // Remove the time from both dates to compare only the date portion
    currentDate.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate <= currentDate) {
      return res.status(400).json({
        message: "Appointment date must be in the future",
      });
    }

    // Fetch user and therapist details
    const user = await userModel.findById(userId);
    const therapist = await therapistModel.findById(therapistId);

    if (!user || !therapist) {
      return res.status(404).json({ message: "User or therapist not found" });
    }

    const now = new Date();
   
    // Check if the appointment date is in the past
    if (date < now) {
      return res
        .status(400)
        .json({ message: "You cannot book an appointment in the past" });
    }

    // Create new appointment
    const appointment = new appointmentModel({
      user: userId, // Important to link the user here
      therapist: therapistId,
      date,
      time,
      status: "pending", // Default status for new appointments
    });

    // Save the appointment
    const savedAppointment = await appointment.save();

    // Push the appointment ID into the user's and therapist's appointments array
    user.appointments.push(savedAppointment._id);
    therapist.appointments.push(savedAppointment._id);

    // Save the user and therapist after updating their appointments
    await user.save();
    await therapist.save();

    // Send email to user
    await sendMail({
      subject: "New Appointment Booked",
      email: user.email,
      html: html.userAppointmentNotificationTemplate(
        user.firstName,
        therapist.firstName,
        date,
        time
      ),
    });

    // Send email to therapist
    await sendMail({
      subject: "Appointment Notification",
      email: therapist.email,
      html: html.therapistNotificationTemplate(
        therapist.firstName,
        user.firstName,
        date,
        time,
        user.email
      ),
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: savedAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ status: "Error booking appointment", error: error.message });
  }
};

exports.getPendingAppointmentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("User ID:", userId); // Log the userId to ensure it's passed correctly

    // Ensure that userId is a valid mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find pending appointments for the given user
    const pendingAppointments = await appointmentModel
      .find({
        user: userId,
        status: "pending",
      })
      .populate("therapist", "name email") // Populate therapist details (name, email)
      .exec();

    console.log("Pending Appointments:", pendingAppointments); // Log the results

    if (pendingAppointments.length === 0) {
      return res.status(404).json({ message: "No pending appointments found" });
    }

    res.status(200).json(pendingAppointments);
  } catch (error) {
    console.error("Error fetching pending appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
