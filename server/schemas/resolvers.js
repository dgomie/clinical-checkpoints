require('dotenv').config(); 
const { User, CheckPoint } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_UN,
    pass: process.env.GMAIL_PW
  },
});

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },

    user: async (parent, { email }) => {
      return await User.findOne({ email });
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
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        officeLocation: userData.officeLocation,
        isAdmin: userData.isAdmin || false, // Ensure isAdmin field is set
      });
      const token = signToken(newUser);
      return { token, user: newUser };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

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
    
    updateCheckPoint: async (parent, { checkPointId, updateData }) => {
      // Find the checkpoint by ID
      const checkPoint = await CheckPoint.findById(checkPointId);
      if (!checkPoint) {
        throw new Error('CheckPoint not found.');
      }

      // Update the checkpoint with the provided data
      Object.assign(checkPoint, updateData);

      // Check if all tasks are completed
      if (checkPoint.tasks.every(task => task.taskCompleted)) {
        checkPoint.checkpointCompleted = true;
        checkPoint.completedAt = new Date();

        console.log('All tasks are completed. Sending emails to admin users.');

        // Fetch the user associated with the checkpoint
        const user = await User.findById(checkPoint.userId);
        if (!user) {
          throw new Error('User not found.');
        }

        // Fetch admin users (assuming you have a User model and admin users have a role field)
        const adminUsers = await User.find({ isAdmin: true });
        console.log(`Fetched ${adminUsers.length} admin users.`);

        // Send email to each admin user
        for (const admin of adminUsers) {
          console.log(`Preparing to send email to ${admin.email}`);
          const mailOptions = {
            from: process.env.GMAIL_UN,
            to: admin.email,
            subject: 'Checkpoint Completed',
            text: `${user.firstName} ${user.lastName} of the ${user.officeLocation} office has completed all tasks of the "${checkPoint.focusArea}" on ${checkPoint.completedAt}.`,
          };

          try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${admin.email}: ${info.response}`);
          } catch (error) {
            console.error(`Error sending email to ${admin.email}:`, error);
          }
        }
      } else {
        checkPoint.checkpointCompleted = false;
        checkPoint.completedAt = null;
      }

      // Save the updated checkpoint
      await checkPoint.save();
      return checkPoint;
    },
  },
};

module.exports = resolvers;