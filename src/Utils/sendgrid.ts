import  sgMail from '@sendgrid/mail';
import { EmailOptions } from '../Types/types';
import dotenv from 'dotenv';
dotenv.config()

// Set your SendGrid API key
let {SENDGRID_API_KEY, EMAIL_FROM } = process.env;
if(!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
}
//make EMAIL_FROM a type of string
let mailFrom: string = EMAIL_FROM? EMAIL_FROM : 'no-reply@everything.florence..co';
sgMail.setApiKey(SENDGRID_API_KEY);

// Create a function to send an email
export const sendEmailSG = async (options: EmailOptions): Promise<void> =>{
    const { to, subject, text, html } = options;
    const msg = {
      from: mailFrom, // Replace with the recipient's email address
      ...options
    };
    sgMail
    .send(msg)
    .then((response) => {
        console.log(response[0].statusCode)
        console.log(response)
    })
    .catch((error) => {
        console.error(error);
    })
}