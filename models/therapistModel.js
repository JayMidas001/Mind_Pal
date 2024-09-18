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
     educationalLevel: { 
        type: String, 
        required:[true, "Kindly enter your level of education"],
        required: true
     },
     feildExperience: { 
        type: String, 
        required:[true, "Kindly enter your experience on the field"],
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
    subscriptionStatus:{
        type:String,
        enum:["inactive", "active"],
        default: "inactive"
    },
    appointments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'appointment'
    }],
    blackList:[]
},{timestamps: true})

const therapistModel = mongoose.model('therapist', therapistSchema)

module.exports = therapistModel