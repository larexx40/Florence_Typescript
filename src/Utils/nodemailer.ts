// import nodemailer, { Transporter } from 'nodemailer';
// import * as sgTransport from 'nodemailer-sendgrid-transport';
// import { EmailOptions } from '../Types/types';
// import smtpTransport = require('nodemailer-smtp-transport');
// import dotenv from 'dotenv';
// dotenv.config()



// const { SMTP_HOST, SMTP_PORT, SMTP_TLS, SMTP_USERNAME, SMTP_PASSWORD, SENDGRID_API_KEY } = process.env;
// const smtpPort = SMTP_PORT ? parseInt(SMTP_PORT, 10) : undefined;
// const sgTransporter: Transporter = nodemailer.createTransport(
//   sgTransport({
//     auth: {
//       api_key: SENDGRID_API_KEY as string,
//     },
//   })
// );

// export const sendMailSG = async (options: EmailOptions): Promise<void> => {
//   const mailOptions: nodemailer.SendMailOptions = {
//     from: 'your-email@example.com', // Sender's email address
//     to: options.to,
//     subject: options.subject,
//     text: options.text,
//   };

//   try {
//     await sgTransporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email');
//   }
// };

// const smtpTransporter = nodemailer.createTransport(
//     smtpTransport({
//         host: SMTP_HOST,
//         port: smtpPort,
//         secure: SMTP_TLS === 'yes' ? true : false,
//         auth: {
//             user: SMTP_USERNAME,
//             pass: SMTP_PASSWORD,
//         },
//     })
// );

// export const sendEmailSMTP = async (options: EmailOptions): Promise<void> => {
//     const { to, subject, text, html } = options;
//     const mailOptions: nodemailer.SendMailOptions = {
//         from: 'your-email@example.com', // Sender's email address
//         to: to,
//         subject: subject,
//         text: text,
//         html: html

//     };

//     try {
//         await smtpTransporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//     }
// };