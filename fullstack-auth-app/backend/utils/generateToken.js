const jwt = require('jsonwebtoken');

module.exports = function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};
