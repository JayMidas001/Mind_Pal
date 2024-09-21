const signUpTemplate = (verifyLink, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MindPal!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: #007bff;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #fff;
        }
        .content {
          padding: 20px;
          color: #333;
        }
        .footer {
          background: #333;
          padding: 10px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #ccc;
        }
        .button {
          display: inline-block;
          background-color: #ff9900;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to MindPal App!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Thank you for joining our community! We're thrilled to have you on board.</p>
          <p>Please click the button below to verify your account:</p>
          <p>
            <a href="${verifyLink}" class="button">Verify My Account</a>
          </p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Best regards,<br>MindPal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MindPal All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


const verifyTemplate = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Mind_pal App</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    .header {
      background: #007bff;
      padding: 10px;
      text-align: center;
      border-bottom: 1px solid #ddd;
      color: #fff;
    }
    .content {
      padding: 20px;
      color: #333;
    }
    .footer {
      background: #333;
      padding: 10px;
      text-align: center;
      border-top: 1px solid #ddd;
      font-size: 0.9em;
      color: #ccc;
    }
    .button {
      display: inline-block;
      background-color: #ff9900;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
    </style>
    </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Account</h1>
      </div>
      <div class="content">
        <p>Hello ${firstName},</p>
        <p>We're excited to have you on board! Please click the button below to verify your account:</p>
        <p>
          <a href="${verifyLink}" class="button">Verify My Account</a>
        </p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>MindPal Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} MindPal All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
};
const forgotPasswordTemplate = (resetLink, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
      body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: #007bff;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #fff;
        }
        .content {
          padding: 20px;
          color: #333;
        }
        .footer {
          background: #333;
          padding: 10px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #ccc;
        }
        .button {
          display: inline-block;
          background-color: #ff9900;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
          <p>Click the button below to reset your password:</p>
          <p>
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>Best regards,<br>MindPal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MindPal All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const userAppointmentNotificationTemplate = (firstName, therapistName, appointmentDate, appointmentTime) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Scheduled</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: #007bff;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #fff;
        }
        .content {
          padding: 20px;
          color: #333;
        }
        .footer {
          background: #333;
          padding: 10px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #ccc;
        }
        .button {
          display: inline-block;
          background-color: #28a745;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Appointment Booked </h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Your appointment with ${therapistName} has been successfully scheduled.</p>
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
          <p>Please ensure you're available at the scheduled time.</p>
          <p>A day before your appointment session an email carrying the link of your virtual therapy session will be sent to you. <br/>Click on the link, on the day of your appoint to have your session conducted. <br/>After your session has been completed please ensure you leave a feedback about the session you had. <br/>Do so with the link below:</p>
          <p><a href=${"https://mindpal-11.vercel.app/#/contact"}>https://mindpal-11.vercel.app/#/contact</a> </p>
          <p>Thank you,<br>MindPal Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MindPal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const therapistNotificationTemplate = (therapistName, userName, appointmentDate, appointmentTime, userEmail) => {
return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Appointment Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        background-color: #fff;
      }
      .header {
        background: #28a745;
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        color: #fff;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .footer {
        background: #333;
        padding: 10px;
        text-align: center;
        border-top: 1px solid #ddd;
        font-size: 0.9em;
        color: #ccc;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Appointment Scheduled</h1>
      </div>
      <div class="content">
        <p>Hello ${therapistName},</p>
        <p>You have a new appointment scheduled with ${userName}.</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
        <p>A day before the appointment, click on the link below to create a google meet:</p>
        <p><a href=${"https://meet.google.com"}>https://meet.google.com</a> </p>
        <p>Send the meeting link to the user with the email below.</p>
        <p>"user email: ${userEmail}"</p>
        <p>Best regards,<br>MindPal Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} MindPal. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
};


module.exports = { signUpTemplate, verifyTemplate, forgotPasswordTemplate, userAppointmentNotificationTemplate, therapistNotificationTemplate};