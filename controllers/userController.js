const userModel = require("../models/userModel")
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendMail} = require("../helpers/email");
const {
    signUpTemplate,
    verifyTemplate,
    forgotPasswordTemplate,
} = require('../helpers/html');

exports.signUp = async (req, res) => {
    try {
        // check if user exists
        const { firstName, lastName, email, password} = req.body;
        if(!firstName || !lastName|| !email || !password){
            return res.status(401).json({
                message: 'Enter all fields.'
            })
        }
        const emailExist = await userModel.findOne({ email: email.toLowerCase()});
        if (emailExist) {
            return res.status(400).json('User with email already exist.');
        } else {
            //perform an encryption using salt
            const saltedPassword = await bcrypt.genSalt(10);
            //perform an encrytion of the salted password
            const hashedPassword = await bcrypt.hash(password, saltedPassword);
            // create object of the body
            const user = new userModel({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword
            });

            const userToken = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "10 Minutes" }
            );
            const verifyLink = `https://mindpal-11.vercel.app/#/waitingforverification/${userToken}`;

            await user.save();
            await sendMail({
                subject: 'Kindly Verify your mail',
                email: user.email,
                html: signUpTemplate(verifyLink, user.firstName),
            });
            res.status(201).json({
                status: 'User created successfully',
                message: `Welcome ${user.firstName} kindly check your gmail to access the link to verify your email`,
                data: user,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        // Extract the token from the request params
        const { token } = req.params;
        // Extract the email from the verified token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user with the email
        const user = await userModel.findOne({ email: email.toLowerCase()});
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified",
            });
        }
        // Verify the user
        user.isVerified = true;
        // Save the user data
        await user.save();
        // Send a success response
        res.status(200).json({
            message: "User verified successfully",
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({ message: "Link expired." });
        }
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(401).json({
                message: 'Enter all fields (Email & Password).'
            })
        }
        const existingUser = await userModel.findOne({email: email.toLowerCase()});
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const confirmPassword = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!confirmPassword) {
            return res.status(404).json({
                message: "Incorrect Password.",
            });
        }
        if (!existingUser.isVerified) {
            return res.status(400).json({
                message:
                    "User not verified, Please check you email to verify your account.",
            });
        }

        const token = await jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successfully",
            data: existingUser,
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user with the email
        const user = await userModel.findOne({ email: email.toLowerCase() });
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified.",
            });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "20mins",
        });
        const verifyLink = `https://mindpal-11.vercel.app/#/waitingforverification/${token}`;
        let mailOptions = {
            email: user.email,
            subject: "Verification email",
            html: verifyTemplate(verifyLink, user.firstName),
        };
        // Send the the email
        await sendMail(mailOptions);
        // Send a success message
        res.status(200).json({
            message: "Verification email resent successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        // Extract the email from the request body
        const { email } = req.body;

        // Check if the email exists in the database
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "30m",
        });
        const resetLink = `https://mindpal-11.vercel.app/#/reset-password/${resetToken}`;

        // Send reset password email
        const mailOptions = {
            email: user.email,
            subject: "Password Reset",
            html: forgotPasswordTemplate(resetLink, user.firstName),
        };
        //   Send the email
        await sendMail(mailOptions);
        //   Send a success response
        res.status(200).json({
            message: "Password reset email sent successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify the user's token and extract the user's email from the token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        // Save changes to the database
        await user.save();
        // Send a success response
        res.status(200).json({
            message: "Password reset successful",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, existingPassword } = req.body;

        // Verify the user's token and extract the user's email from the token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Confirm the previous password
        const isPasswordMatch = await bcrypt.compare(
            existingPassword,
            user.password
        );
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Existing password does not match.",
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        // Save the changes to the database
        await user.save();
        //   Send a success response
        res.status(200).json({
            message: "Password changed successful",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName } = req.body;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            });
        }

        // Prepare the data for updating
        const data = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            image: user.image
        };

        if (req.file) {
            if (user.image) {
                const userImageId = user.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(userImageId); // Destroy old image
            }

            // Upload new image
            const file = req.file;
            const pic = await cloudinary.uploader.upload(file.path); // Correct method and path

            data.image = pic.secure_url; // Update data with new image URL
        }

        // Update the user document
        const updatedUser = await userModel.findByIdAndUpdate(userId, data, { new: true });

        res.status(200).json({
            status: 'user updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.makeAdmin = async(req, res)=> {
    try {
        const {userId} = req.params
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json(`User with ID ${userId} was not found`)
        }
        user.isAdmin = true
        await user.save()
        res.status(200).json({message: `Dear ${user.firstName}, you're now an admin`, data: user})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.getAll = async(req,res)=>{
    try {
     const users = await userModel.find()
     if(users.length <= 0){
        return res.status(404).json('No available users')
     }else{
        res.status(200).json({message:`Kindly find the ${users.length} registered users below`, data: users})
     }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.getOne = async (req, res) => {
    try {
        const {userId} = req.params

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json('User not found.')
        }
        res.status(200).json({
            message: `Kindly find the user with ${userId} below`,
            data: user
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.deleteUser = async (req, res) =>{
    try {
        const {userId} = req.params
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json('User not found.')
        }
        const deleteOneUser = await userModel.findByIdAndDelete(userId)
        res.status(200).json('User deleted successfully.')
    } catch (error) {
        res.status(500).json(error.message)
    }
}
//signout user
exports.logOut = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(' ')[1];

        if(!token){
            return res.status(401).json({
                message: 'invalid token'
            })
        }
        // Verify the user's token and extract the user's email from the token
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user by ID
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.blackList.push(token);
        // Save the changes to the database
        await user.save();
        //   Send a success response
        res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


exports.createMessage = async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        const userId = req.user.id; // Extract userId from the token (from JWT)

        // Validate required fields
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Find the user by userId
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a new message and push it into the user's messages array
        user.messages.push({
            firstName,
            lastName,
            email,
            message
        });

        // Save the updated user document
        await user.save();

        res.status(201).json({ message: 'Message added successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'An error occurred while adding the message.', 
                                message:error.message });
    }
};

const User = require('../models/userModel');

exports.createMessage = async (req, res) => {
    try {
        const {userId}= req.params
        const { firstName, lastName, email, message } = req.body;
       

        // Validate required fields
        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Create a new message and push it into the user's messages array
        user.messages.push({
            firstName,
            lastName,
            email,
            message
        });

        // Save the updated user document
        await user.save();

        res.status(201).json({ message: 'Message added successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the message.' });
    }
};
