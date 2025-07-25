import { verifyToken } from '../config/jwt.config.js';
import { auth } from '../config/firebase.config.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return errorResponse(res, 401, 'Not authorized, no token');
    }
    
    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, token failed');
  }
};