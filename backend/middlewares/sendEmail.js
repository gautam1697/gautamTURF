const nodemailer=require('nodemailer');
exports.sendEmail=async(options)=>{
        
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9dd6aae3d974c2",
      pass: "e3292bfed52dbc"
    }
  });
        
        const mailOptions={
            from:'11@gmail.com',
            to:options.email,
            subject:options.subject,
            text:options.message,
        }

        await transporter.sendMail(mailOptions)
        

}

