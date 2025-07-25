import { auth, db } from '../config/firebase.config.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRecord = await auth.getUser(userId);
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    return successResponse(res, 200, {
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName,
      ...userData
    });
  } catch (error) {
    return errorResponse(res, 404, 'User not found');
  }
};