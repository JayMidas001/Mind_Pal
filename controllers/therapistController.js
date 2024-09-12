const therapistModel = require("../models/therapistModel")
const fs = require('fs')
require('dotenv')
const cloudinary = require(`../utils/cloudinary`)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendMail} = require("../helpers/email")
const {
    signUpTemplate,
    verifyTemplate,
    forgotPasswordTemplate,
} = require('../helpers/html')

exports.signUpTherapist = async (req, res) => {
    try {
        const { firstName, lastName, specialty, phoneNumber, email, password } = req.body;

        if (!firstName || !lastName || !specialty || !phoneNumber || !email || !password) {
            return res.status(401).json({ message: 'Enter all fields.' });
        }

        const emailExist = await therapistModel.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: 'Therapist already exists' });
        }

        const saltedPassword = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedPassword);

        let certificateUrl = null;
        let idCardUrl = null;

        if (req.files) {
            // Handling certificate upload
            if (req.files.certificate) {
                const certificate = req.files.certificate[0]; // Access file from req.files
                const result = await cloudinary.uploader.upload(certificate.path);
                certificateUrl = result.secure_url;
            }

            // Handling ID card upload
            if (req.files.idCard) {
                const idCard = req.files.idCard[0]; // Access file from req.files
                const result = await cloudinary.uploader.upload(idCard.path);
                idCardUrl = result.secure_url;
            }
        }
        const therapist = new therapistModel({
            firstName,

            lastName,
            specialty,
            idCard: idCardUrl,
            certificate: certificateUrl,
            phoneNumber,
            email,
            password: hashedPassword,
        });

        const therapistToken = jwt.sign({ id: therapist._id, email: therapist.email }, process.env.JWT_SECRET, { expiresIn: '3m' });
        const verifyLink = `${req.protocol}://${req.get('host')}/api/v1/verify${therapistToken}`;

        await therapist.save();
        await sendMail({
            subject: 'Kindly verify your email',
            email: therapist.email,
            html: signUpTemplate(verifyLink, therapist.firstName)
        });

        res.status(201).json({
            message: `Welcome ${therapist.firstName}, kindly check your email to access the link to verify your email`,
            data: therapist
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail = async(req, res)=>{
    try {
        // Extract the token from the request params
        const { token } = req.params;
        //extract the token from the request params
        const {email} = jwt.verify(token, process.env.JWT_SECRET)
        //find the therapist email
        const therapist =await therapistModel.findOne({email})
        // check if the therapist is in the database
        if(!therapist){
            return res.status(404).json({
                message: ' therapist not found'
            })
        }
        //check if the therapist is already verified
        if(therapist.verify){
            return res.status(400)({
                message: ' therapist already verified'
            })
        }
        //verify the therapist
        therapist.isVerified = true
        //save the user data
        await therapist.save()
        //send a success response
        res.status(200).json({
            message: ' therapist verified successfully'
        })
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return res.json({
                message: 'link expired'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

exports.logInTherapist = async(req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({
                message: 'Enter all fields (Email & Password).'
            })
        }
        const existingTherapist = await therapistModel.findOne({email: email.toLowerCase()})
        if(!existingTherapist){
            return res.status(404).json({
                message: ' Therapist not found'
            })
        }
        const confirmPassword = await bcrypt.compare(password, existingTherapist.password)
        if(!confirmPassword){
            return res.status(404).json({
                message: 'Incorrect password'
            })
        }
        if(!existingTherapist.isVerified){
            return res.status(400).json({
                message: 'therapist not verify check your email to verify your account'
            })
        }
        const token = await jwt.sign({
            userId: existingTherapist._id,
            email:existingTherapist.email
        }, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.status(200).json({
            message: 'login successfully',
            data: existingTherapist,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.resendVerificationEmail = async(req, res)=>{
    try {
        const{email} = req.body
        //find the therapist with the email
        const therapist = await therapistModel.findOne({email})
        //check if the therapist is still in the database
        if(!therapist){
            return res.status(404).json({
                message: 'Therapist not found'
            })
        }

        // check if the therapist has already been verified
        if(therapist.isVerified){
            return res.status(400).json({
                message: 'Therapist already verified'
            })
        }

        const token = jwt.sign({email:therapist.email}, process.env.JWT_SECRET, {expiresIn: '20min'})
        const verifyLink = `${req.protocol}://${req.get('host')}/api/v1/verify/${token}`
        let mailOptions ={
            email: therapist.email,
            subject:'verification Email',
            html: verifyTemplate(verifyLink,therapist.firstName)
        }
        //send the mail
        await sendMail(mailOptions)
        // send success message
        res.status(200).json({
            message: 'Verification email resent successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.forgotPassword = async (req, res)=>{
    try {
        // extract the email from the request body
        const{email}= req.body

        //check if the email exist in the database
        const therapist = await therapistModel.findOne({email})
        if(!therapist){
            return res.status(404).json({
                message: 'therapist not found'
            })
        }

        // generate a reset token
        const resetToken = jwt.sign({email:therapist.email}, process.env.JWT_SECRET,{expiresIn:'30m'})
        const resetLink = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${resetToken}`

        //send a reset password email
        const mailOptions = {
            email: therapist.email,
            subject: 'Password reset',
            html: forgotPasswordTemplate(resetLink, therapist.firstName)
        }
        //send the email
        await sendMail(mailOptions)
        // send a success response
        res.status(200).json({
            message: ' password reset email sent successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetPassword = async(req, res)=>{
    try {
        const {token} = req.params
        const {password} = req.body

        //verify the therapist's token and extract the therapist's email from the token
        const {email}= jwt.verify(token, process.env.JWT_SECRET)
        
        //find therapist by ID
        const therapist = await therapistModel.findOne({email})
        if(!therapist){
            return res.status(404).json({
                message: 'therapist not found'
            })
        }

        //salt and hash the password
        const saltedRound = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltedRound)

        //update the therapist password
        therapist.password = hashedPassword

        //save changes in database
        await therapist.save()

        //send a response message
        res.status(200).json({
            message:'password reset successful'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.changePassword = async(req, res)=>{
    try {
        const {token} = req.params
        const{password,existingPassword} = req.body

        //verify the therapist's token and extract the therapist's email from the token
        const {email} = jwt.verify(token, process.env.JWT_SECRET)

        //find the ID
        const therapist = await therapistModel.findOne({email})
        if(!therapist){
            return res.status(404).json({
                message: ' therapist not found'
            })
        }

        //confirm the previous password
        const isPasswordMatch = await bcrypt.compare(existingPassword, therapist.password)
        if(!isPasswordMatch){
            return res.status(401).json({
                message: ' existing password does not match'
            })
        }

        //salt and hash password

        const saltedPassword = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltedPassword)

        //update the therapist password
        therapist.password = hashedPassword

        //save the changes in the database
        await therapist.save()

        //send a success response
        res.status(200).json({
            message: ' password change successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneTherapist = async(req, res)=>{
    try {
        const {id} = req.params
        const oneTherapist = await therapistModel.findById(id);
        if(!oneTherapist){
            return res.status(404).json({
                message: ' therapist not found'
            })
        }
        res.status(200).json({
            message: 'therapist details',
            data: oneTherapist
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAllTherapists = async(req, res)=>{
    try {
        
        const therapists = await therapistModel.find();
        if(!therapists.length === 0){
            return res.status(404).json({
                message: ' therapist not found'
            })
        }
        res.status(200).json({
            message: 'therapists details',
            data: therapists
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateTherapist = async (req, res) => {
    try {
        const { therapistId } = req.params;
        const { firstName, lastName, phoneNumber } = req.body;

        // Find the therapist by ID
        const therapist = await therapistModel.findById(therapistId);
        if (!therapist) {
            return res.status(404).json({
                message: 'Therapist not found'
            });
        }

        // Prepare the data for updating
        const data = {
            firstName: firstName || therapist.firstName,
            lastName: lastName || therapist.lastName,
            phoneNumber: phoneNumber || therapist.phoneNumber,
            photo: therapist.photo
        };

        if (req.file) {
            if (therapist.photo) {
                const therapistPhotosId = therapist.photo.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(therapistPhotosId); // Destroy old image
            }

            // Upload new image
            const file = req.file;
            const image = await cloudinary.uploader.upload(file.path); // Correct method and path

            data.photo = image.secure_url; // Update data with new image URL
        }

        // Update the therapist document
        const updatedTherapist = await therapistModel.findByIdAndUpdate(therapistId, data, { new: true });

        res.status(200).json({
            status: 'Therapist updated successfully',
            data: updatedTherapist
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.deleteTherapist = async (req, res) => {
    try {
      const { id } = req.params;
      const therapist = await therapistModel.findByIdAndDelete(id);
      if (user.photos && user.photos.length > 0) {
        user.photos.forEach((photo) => {
          const oldFilePath = `uploads/${photo}`;
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        });
      }
      res.status(200).json(`Therapist deleted successfully`);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  //signout therapist
exports.logOutTherapist = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(' ')[1];

        if(!token){
            return res.status(401).json({
                message: 'invalid token'
            })
        }
        // Verify the therapist's token and extract the therapist's email from the token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        // Find the therapist by ID
        const therapist = await therapistModel.findOne({ email });
        if (!therapist) {
            return res.status(404).json({
                message: "Therapist not found"
            });
        }
        therapist.blackList.push(token);
        // Save the changes to the database
        await therapist.save();
        //   Send a success response
        res.status(200).json({
            message: "therapist logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}