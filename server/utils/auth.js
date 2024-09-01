require('dotenv').config({ path: '../.env' });
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');


const secret = process.env.SESSION_SECRET;
const expiration = '48h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: ({ req }) => {
    const token = req.headers.authorization || '';
  
    if (!token) {
      return req
    }
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
      return { user: decoded.data };
    } catch (err) {
      console.log(err);
    }
  },
  verifyJWT: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Assuming Bearer token
      jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401); // Unauthorized
    }
  },
  signToken: function ({ email, _id , formattedCreatedAt  }) {
    const payload = { email, _id, formattedCreatedAt };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
