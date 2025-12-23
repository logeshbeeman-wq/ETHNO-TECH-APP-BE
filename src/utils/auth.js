import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ec38c1e12f69ed4583c985e21062b3e389b938ffc3f930672fcc929160820282';
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
