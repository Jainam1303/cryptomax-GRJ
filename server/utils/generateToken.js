const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = {
    user: {
      id: userId
    }
  };

  const jwtSecret = process.env.JWT_SECRET || 'super_secure_12345';
  const jwtExpiration = process.env.JWT_EXPIRATION || '24h';

  return jwt.sign(
    payload,
    jwtSecret,
    { expiresIn: jwtExpiration }
  );
};

module.exports = generateToken;