import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const authMiddleware = (requiredRole = 'user') => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authentication required');
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (requiredRole === 'admin' && decoded.role !== 'admin') {
        throw new Error('Admin access required');
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };
};
