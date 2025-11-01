// utils/authHelpers.js
import validator from 'validator';

export const isEmail = (v) => validator.isEmail(String(v || ''));
export const isIndianMobile = (v) => /^[6-9]\d{9}$/.test(String(v || '').replace(/\D/g, ''));
export const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
export const otpExpiryDate = (mins = 10) => new Date(Date.now() + mins * 60 * 1000);
