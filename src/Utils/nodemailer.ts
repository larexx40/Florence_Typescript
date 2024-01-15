import nodemailer from 'nodemailer';
import { EmailOption } from '../Types/types';
import dotenv from 'dotenv';
dotenv.config()



const { SMTP_HOST, SMTP_PORT, SMTP_TLS, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
console.log(SMTP_HOST, SMTP_PORT, SMTP_TLS, SMTP_USERNAME, SMTP_PASSWORD);

if(!SMTP_HOST || !SMTP_PORT || !SMTP_USERNAME || !SMTP_PASSWORD){
    throw new Error('Mail server configuration is not set');
}
const smtpPort = SMTP_PORT ? parseInt(SMTP_PORT, 10) : undefined;

const transport = nodemailer.createTransport({
    host: SMTP_HOST,
      port: smtpPort, // Adjust the port based on your server's configuration
      secure: (SMTP_TLS === '1')? true: false, // Set to true if using SSL/TLS
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
    },
});


transport.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
});

 // Function to send an email
export const sendMailNM = async (options: EmailOption): Promise<boolean> => {
  try {
    // Email options
    const msg = {
        from: (options.from)? options.from : "no-reply@everything.florence" , // Replace with the recipient's email address
        ...options
    };
    // Send mail
    const info = await transport.sendMail(msg);
    console.log('Email sent: ', info.messageId);
    // Email sent successfully;
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Error sending email');
    // Email sending failed
    return false;
  }
}