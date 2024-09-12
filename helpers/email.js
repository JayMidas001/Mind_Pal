const nodeMailer = require('nodemailer')

require ("dotenv").config()

const sendMail =async (options)=>{

const transporter = await nodeMailer.createTransport(
    {    
     secure: true,
      service :  process.env.SERVICE,
     
 auth: {
         user:process.env.MAIL_ID,
          pass:process.env.MAIL_PASSWORD  ,
        },
      }
    
)

console.log(options.email)
let mailOptions = {
    from: process.env.MAIL_ID,
    to: options.email,
    subject: options.subject,
    // text: options.message
  html:options.html
//   
}
  await transporter.sendMail(mailOptions)

}



module.exports = {sendMail}