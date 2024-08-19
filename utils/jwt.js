const jwt = require('jsonwebtoken');


const createJWT = async ({ payload }) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: Date.now() + 365 * 24 * 60 * 60 * 1000
    });
    return token;
  } catch (error) {
    console.error('Error creating JWT:', error);
    return null;
  }
};
 
module.exports = {
  createJWT
};