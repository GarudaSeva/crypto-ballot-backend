const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function authenticateOptional(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    // Set guest user if no token provided
    req.user = { id: null, role: 'guest' };
  }
  // Continue even without token, requireAdmin will check
  next();
}

function requireAdmin(req, res, next) {
  // Allow admin token (id === 'admin' means it's from env-based login)
  if (req.user?.role === 'admin' || req.user?.id === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin only' });
}

module.exports = { authenticate, authenticateOptional, requireAdmin };
