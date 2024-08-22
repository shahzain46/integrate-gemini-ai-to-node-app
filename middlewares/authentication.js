const jwt = require('jsonwebtoken')


const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('token')

    if (!token) {
      return res.status(401).send({ message: "Authentication Invalid" });
    }

    let isValidAccessToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = isValidAccessToken.user
    next()
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(401).send({ message: error.message });
  }
};



module.exports = {
  authenticateUser
};