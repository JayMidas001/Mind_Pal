const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    set: (entry) => entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase(),
    required: [true, 'Kindly enter your first name']
  },
  lastName: {
    type: String,
    set: (entry) => entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase(),
    required: [true, 'Kindly enter your last name']
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment',
  }],
  blackList: [],
  
  // Embedding messages directly into the user model
  messages: [messageSchema],  // An array of message objects
  
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
