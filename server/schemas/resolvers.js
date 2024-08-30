const { User, CheckPoint } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const mongoose = require('mongoose');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },

    user: async (parent, { username }) => {
      return await User.findOne({ username });
    },

    userById: async (parent, { id }) => {
      return await User.findById(id);
    },

    checkPoints: async () => {
      return await CheckPoint.find();
    },

    checkPoint: async (parent, { id }) => {
      return await CheckPoint.findById(id);
    },
  },

  Mutation: {
    addUser: async (parent, { userData }) => {
      const newUser = await User.create({
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
      });
      const token = signToken(newUser);
      return { token, user: newUser };
    },

    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);

      return { token, user };
    },

    removeUser: async (parent, { userId }) => {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error('User not found.');
      }
      return deletedUser;
    },

    updateUser: async (_, { userId, updateData }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      );
      return updatedUser;
    },

    addCheckPoint: async (parent, { input }) => {
      const checkPoint = await CheckPoint.create(input);
      return checkPoint;
    },

  },
};

module.exports = resolvers;
