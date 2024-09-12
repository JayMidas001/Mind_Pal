const appointmentModel = require("../models/appointmentModel")


exports.createAppointment = async (req, res) => {
  const { userId, therapistId, date, time } = req.body;
  try
   {
    const appointment = new appointmentModel({
      user: userId,
      therapist: therapistId,
      date,
      time,
    });

    await appointment.save();
    res.status(201).json({message: "appointment booked successfully"});
  } catch (error) {
    res.status(400).json({ error: 'Error booking appointment', details: error });
  }
};

exports.getUserAppointments = async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await appointmentModel.find({ userId }).populate('therapist');
    res.status(200).json({message: " successful get user appointment", data: appointments});
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving appointments', details: error });
  }
};

exports.getTherapistAppointments = async (req, res) => {
  const { therapistId } = req.params;

  try {
    const appointments = await appointmentModel.find({ therapistId }).populate('user');
    res.status(200).json({message: "successfully get therapist appointments", data: appointments});
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving appointments', details: error });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(200).json({message:"appointment updated successfully"});
  } catch (error) {
    res.status(400).json({ error: 'Error updating appointment', details: error });
  }
};
