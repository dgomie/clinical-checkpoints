require('dotenv').config();
const { User, CheckPoint } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const checkpointData = require('../seeders/checkpointData');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_UN,
    pass: process.env.GMAIL_PW,
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

    checkPoints: async (parent, { userId }) => {
      return await CheckPoint.find({ userId });
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
        isAdmin: userData.isAdmin || false,
      });

      const updatedCheckpointData = checkpointData.map((checkpoint) => ({
        ...checkpoint,
        userId: newUser._id,
      }));

      await CheckPoint.create(updatedCheckpointData);

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

    adminUpdateUser: async (_, { userId, updateData }) => {
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
      const checkPoint = await CheckPoint.findById(checkPointId);
      if (!checkPoint) {
        throw new Error('CheckPoint not found.');
      }

      Object.assign(checkPoint, updateData);

      if (checkPoint.tasks.every((task) => task.taskCompleted)) {
        checkPoint.checkpointCompleted = true;
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        checkPoint.completedAt = new Date().toLocaleString('en-US', {
          timeZone: userTimeZone,
        });

        console.log('All tasks are completed. Sending emails to admin users.');

        const user = await User.findById(checkPoint.userId);
        if (!user) {
          throw new Error('User not found.');
        }

        const adminUsers = await User.find({ isAdmin: true });
        console.log(`Fetched ${adminUsers.length} admin users.`);

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
      await checkPoint.save();
      return checkPoint;
    },

    updateCheckpointsByFocusArea: async (_, { focusArea, officeLocation, assign }) => {
      try {
        const checkpoints = await CheckPoint.find({ focusArea });

        const updatedCheckpoints = [];
        for (const checkpoint of checkpoints) {
          const user = await User.findById(checkpoint.userId);
          if (user && user.officeLocation === officeLocation) {
            checkpoint.checkpointAssigned = assign;
            await checkpoint.save();
            updatedCheckpoints.push(checkpoint);
          }
        }

        return updatedCheckpoints;
      } catch (error) {
        throw new Error('Failed to update checkpoints.');
      }
    },
    addTaskToCheckPoint: async (_, { userId, focusArea, description }) => {
      try {
        const checkPoint = await CheckPoint.findOne({ userId, focusArea });
        if (!checkPoint) {
          throw new Error('CheckPoint not found');
        }

        const newTask = { description, taskCompleted: false };
        checkPoint.tasks.push(newTask);

        if (checkPoint.checkpointCompleted) {
          checkPoint.checkpointCompleted = false;
          checkPoint.completedAt = null;
        }

        await checkPoint.save();

        return checkPoint;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
