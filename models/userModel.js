const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    email:{type:String,
        require: true
    },
    password:{type:String,
        require: true
    },
    image:{
        type: String
    },
    isAdmin:{type: Boolean, 
        default: false},
    isVerified:{type: Boolean, 
        default: false},
    blackList:[]
},{timestamps: true})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel