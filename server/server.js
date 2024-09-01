const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware, verifyJWT } = require("./utils/auth");
require('dotenv').config();
const cors = require('cors');
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');


const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({ limit: '50mb' }));

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  app.use(cors());


  app.post('/verify-password', verifyJWT, async (req, res) => {
    const { userId, currentPassword } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
 
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
 
        return res.status(400).json({ message: 'Incorrect password' });
      }

      res.status(200).json({ message: 'Password verified' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/update-password', verifyJWT, async (req, res) => {
    const { userId, newPassword } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.password = newPassword
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
