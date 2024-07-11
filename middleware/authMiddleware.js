// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();
// const User = require('../models/User');
// const { JWT_SECRET } = process.env;
// const JWT_SECRET = process.env.JWT_SECRET;


// module.exports = (req, res, next) => {
//   // Get the token from the cookies
//   const token = req.cookies.token;


//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded:', decoded);
//     req.user = decoded.userId;
//     next();
//   } catch (err) {
//     console.error('Token verification error:', err);
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };


// const authMiddleware = {
//     verifyToken: (req, res, next) => {
//         try{
//             const token = req.cookies.token;
//             console.log('Token:', token);
//             if(!token) return res.status(401).json({msg: 'No token, authorization denied'});
//             try{
//                 const decoded = jwt.verify(token, process.env.JWT_SECRET);
//                 req.user = decoded.userId;
//                 next();
//             }
//             catch(err){
//                 return res.status(401).json({msg: 'Token is not valid'});
//             }
//         }
//         catch(err){
//             return res.status(500).json({msg: 'Server error'});
//         }

//     }
// }

// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the token from the headers
  const token = req.header('x-auth-token');
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
