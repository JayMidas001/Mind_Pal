const Joi = require("@hapi/joi");

const validationSignUp = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)*$/)) // Adjust regex to disallow punctuation
      .messages({
        "any.required": "First name is required.",
        "string.empty": "First name cannot be an empty string.",
        "string.min": "First name must be at least 3 characters long.",
        "string.pattern.base": "First name cannot start or end with whitespace and cannot contain punctuation.",
      }),
      lastName: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)*$/)) // Adjust regex to disallow punctuation
      .messages({
        "any.required": "Last name is required.",
        "string.empty": "Last name cannot be an empty string.",
        "string.min": "Last name must be at least 3 characters long.",
        "string.pattern.base": "Last name cannot start or end with whitespace and cannot contain punctuation.",
      }),
      phoneNumber: Joi.string()
      .length(11)
      .pattern(/^\d+$/)
      .messages({
        "string.length": "Phone number must be exactly 11 digits.",
        "string.pattern.base": "Phone number must contain only numeric digits.",
      }),

    email: Joi.string().email().required().messages({
      "any.required": "Email is required.",
      "string.email": "Invalid email format.",
    }),
    
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .required()
      .messages({
        "any.required": "Password is required.",
        "string.pattern.base":
          "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
      }),specialty: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp(/^[A-Za-z .,'-]+$/))  // Allows letters, spaces, and common punctuations (.,'-)
      .messages({
          "any.required": "First name is required.",
          "string.empty": "First name cannot be an empty string.",
          "string.min": "First name must be at least 3 characters long.",
          "string.pattern.base": "First name can only contain letters, spaces, and punctuation (.,'-).",
      }),
      educationalLevel: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp(/^[A-Za-z .,'-]+$/))  // Allows letters, spaces, and common punctuations (.,'-)
      .messages({
          "any.required": "First name is required.",
          "string.empty": "First name cannot be an empty string.",
          "string.min": "First name must be at least 3 characters long.",
          "string.pattern.base": "First name can only contain letters, spaces, and punctuation (.,'-).",
      }),
      fieldExperience: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp(/^[A-Za-z .,'-]+$/))  // Allows letters, spaces, and common punctuations (.,'-)
      .messages({
          "any.required": "First name is required.",
          "string.empty": "First name cannot be an empty string.",
          "string.min": "First name must be at least 3 characters long.",
          "string.pattern.base": "First name can only contain letters, spaces, and punctuation (.,'-).",
      })
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there's a validation error, return a response with the error details
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(" ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};

const validationLogIn = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required.",
        "string.email": "Invalid email format.",
      }),
      
      password: Joi.string()
        .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
        .required()
        .messages({
          "any.required": "Password is required.",
          "string.pattern.base":
            "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
        }),
    });
  
    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    // If there's a validation error, return a response with the error details
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(" ");
      return res.status(400).json({ error: errorMessage });
    }
  
    // If validation is successful, move to the next middleware
    next();
  };


const validationEmail = (req, res, next) => {
    // Define the validation schema using Joi
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required.",
        "string.email": "Invalid email format.",
      }),
      
    });
  
    // Validate the request body against the schema
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    // If there's a validation error, return a response with the error details
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(" ");
      return res.status(400).json({ error: errorMessage });
    }
  
    // If validation is successful, move to the next middleware
    next();
  };



const validationUpdate = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    firstName: Joi.string().min(3).pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
      "string.empty": "First name cannot be an empty string.",
      "string.min": "First name must be at least 3 characters long.",
      "string.pattern.base": "First name cannot start or end with a whitespace.",
    }),
    lastName: Joi.string().min(3).pattern(new RegExp(/^[^\s].+[^\s]$/)).messages({
        "string.empty": "Last name cannot be an empty string.",
        "string.min": "Last name must be at least 3 characters long.",
        "string.pattern.base": "Last name cannot start or end with a whitespace.",
      }),
      phoneNumber: Joi.string()
      .length(11)
      .pattern(/^\d+$/)
      .messages({
        "string.length": "Phone number must be exactly 11 digits.",
        "string.pattern.base": "Phone number must contain only numeric digits.",
      }),

    email: Joi.string().email().messages({
        "any.required": "Email is required.",
      "string.email": "Invalid email format.",
      
    }),
    
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .messages({
        "string.pattern.base":
          "Password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
      }),
  });



  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there's a validation error, return a response with the error details
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(" ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};


const validationPassword = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
   
    newPassword: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .messages({
        "string.pattern.base":
          "New password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
      }),
    existingPassword: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .messages({
        "string.pattern.base":
          "Existing password must contain at least 8 characters, one capital letter, and one special character (!@#$%^&*).",
      }),
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there's a validation error, return a response with the error details
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(" ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};




module.exports = { 
  validationSignUp,
  validationLogIn,
  validationEmail,
  validationUpdate,
  validationPassword
  }