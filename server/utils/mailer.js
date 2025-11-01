// utils/mailer.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,         // "dakshatjoust1@gmail.com"
    pass: process.env.MAIL_APP_PASSWORD, // Gmail App Password (16 chars)
  },
});

export async function sendOTPEmail(to, otp) {
  return transporter.sendMail({
    from: `"WorkerConnect" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your WorkerConnect verification code',
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
}
