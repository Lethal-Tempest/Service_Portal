import { auth } from '../config/firebase.config.js';
import { generateToken } from '../config/jwt.config.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });
    
    const token = generateToken(userRecord.uid);
    
    return successResponse(res, 201, {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      token
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would verify the password with Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    
    const token = generateToken(userRecord.uid);
    
    return successResponse(res, 200, {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      token
    });
  } catch (error) {
    return errorResponse(res, 401, 'Invalid credentials');
  }
};