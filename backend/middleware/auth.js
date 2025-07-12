     const jwt = require('jsonwebtoken');
     require('dotenv').config();

     module.exports = function (req, res, next) {
       // Get token from header
       const token = req.header('x-auth-token'); // Common header name, or 'Authorization'

       // Check if not token
       if (!token) {
         // Also check for Authorization: Bearer token format
         const authHeader = req.header('Authorization');
         if (authHeader && authHeader.startsWith('Bearer ')) {
           const bearerToken = authHeader.slice(7, authHeader.length);
           if (!bearerToken) {
             return res.status(401).json({ msg: 'No token, authorization denied' });
           }
           try {
             const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
             req.user = decoded.user;
             next();
           } catch (err) {
             res.status(401).json({ msg: 'Token is not valid' });
           }
         } else {
            return res.status(401).json({ msg: 'No token, authorization denied' });
         }
       } else {
         // If x-auth-token is used
         try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           req.user = decoded.user;
           next();
         } catch (err) {
           res.status(401).json({ msg: 'Token is not valid' });
         }
       }
     };
     