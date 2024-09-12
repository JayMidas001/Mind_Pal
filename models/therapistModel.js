const mongoose = require('mongoose')

const therapistSchema = new mongoose.Schema({
    firstName:{type:String,set: (entry) => {
        const capitalize =
        entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
          return capitalize;},required:[true,'Kindly enter your first name'],
        required:true
    },
    lastName:{type:String,set: (entry) => {
        const capitalize =
        entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
          return capitalize;},required:[true,'Kindly enter your last name'],
        required:true
    },
    specialty: { 
        type: String, 
        required:[true, "Kindly enter your specialty"],
        required: true
     },
    idCard: { 
        type: String,
        
     }, // Path to the ID card image
    certificate: { 
        type: String, 
        
    }, // Path to the certificate file
    phoneNumber: { type: String },
    email:{type:String,
        require: true,
        unique: true
    },
    password:{type:String,
        require: true
    },
    photo:{
        type: String
    },
    isVerified:{type: Boolean, 
        default: false},
    blackList:[]
},{timestamps: true})

const therapistModel = mongoose.model('therapist', therapistSchema)

module.exports = therapistModel