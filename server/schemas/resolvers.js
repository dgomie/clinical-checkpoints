const { User, Legion } = require('../models');
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

    legions: async () => {
      return await Legion.find();
    },

    legion: async (parent, { id }) => {
      return await Legion.findById(id);
    },

    standings: async (parent, { legionId }) => {
      const legion = await Legion.findById(legionId);
      if (!legion) {
        throw new Error('Legion not found');
      }
      return legion.standings;
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

    addLegion: async (parent, { legionData }, context) => {
      if (!context.user) {
        throw AuthenticationError;
      }

      const newLegion = await Legion.create({
        ...legionData,
        adminUser: new mongoose.Types.ObjectId(context.user._id),
        players: [new mongoose.Types.ObjectId(context.user._id)], // Use 'new' keyword
      });

      return newLegion;
    },

    updateLegion: async (_, { legionId, updateData }) => {
      try {
        const legion = await Legion.findById(legionId);
        if (!legion) {
          throw new Error('Legion not found');
        }

        // Update the legion with the new data
        Object.assign(legion, updateData);

        // Save the legion to trigger the pre-save hook
        await legion.save();

        return legion;
      } catch (err) {
        console.error('Error updating legion:', err);
        throw new Error('Failed to update legion');
      }
    },

    removeLegion: async (parent, { legionId }) => {
      const deletedLegion = await Legion.findByIdAndDelete(legionId);
      if (!deletedLegion) {
        throw new Error('Legion not found.');
      }
      return deletedLegion;
    },

    createRound: async (_, { legionId, roundInput }) => {
      const legion = await Legion.findById(legionId);
      if (!legion) {
        throw new Error('Legion not found');
      }

      const newRound = {
        _id: new mongoose.Types.ObjectId(),
        ...roundInput,
        submissions: [],
        votes: [],
      };

      legion.rounds.push(newRound);
      await legion.save();
      return legion;
    },

    updateRound: async (_, { legionId, roundId, roundData }) => {
      const legion = await Legion.findById(legionId);
      if (!legion) {
        throw new Error('Legion not found');
      }
    
      const round = legion.rounds.id(roundId);
      if (!round) {
        throw new Error('Round not found');
      }
    
      Object.assign(round, roundData);
      await legion.save();
    
      // Manually call updateStandings after saving the Legion document
      await legion.updateStandings();
    
      return legion;
    },

    async addSongToRound(_, { legionId, roundNumber, songInput }) {
      try {
        // Find the legion by its ID
        const legion = await Legion.findById(legionId);

        if (!legion) {
          throw new UserInputError('Legion not found');
        }

        // Find the round by its round number
        const round = legion.rounds.find((r) => r.roundNumber === roundNumber);

        if (!round) {
          throw new UserInputError('Round not found');
        }

        // Create a new song object
        const newSong = {
          userId: songInput.userId,
          title: songInput.title,
          artist: songInput.artist,
          comment: songInput.comment,
          url: songInput.url,
        };

        // Add the song to the submissions array
        round.submissions.push(newSong);

        await legion.save();

        return legion;
      } catch (error) {
        console.error('Error adding song to round:', error.message);
        throw new UserInputError(error.message);
      }
    },

    async updateSong(_, { legionId, roundNumber, songId, updateData }) {
      try {
        // Find the legion by its ID
        const legion = await Legion.findById(legionId);

        if (!legion) {
          throw new UserInputError('Legion not found');
        }

        // Find the round by its round number
        const round = legion.rounds.find((r) => r.roundNumber === roundNumber);

        if (!round) {
          throw new UserInputError('Round not found');
        }

        // Find the song by its ID
        const song = round.submissions.id(songId);

        if (!song) {
          throw new UserInputError('Song not found');
        }

        // Update the song's details
        Object.assign(song, updateData);

        await legion.save();

        return legion;
      } catch (error) {
        console.error('Error updating song:', error.message);
        throw new UserInputError(error.message);
      }
    },

    incrementNumSongs: async (_, { userId }) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { numSongs: 1 } },
        { new: true }
      );
    },

    incrementNumVotes: async (_, { userId }) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { numVictories: 1 } },
        { new: true }
      );
    },

    incrementNumVictories: async (_, { userId }) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { numVictories: 1 } },
        { new: true }
      );
    },

    incrementNumLegions: async (_, { userId }) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { numLegions: 1 } },
        { new: true }
      );
    },

    decrementNumLegions: async (_, { userId }) => {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { numLegions: -1 } },
        { new: true }
      );
    },

    updateStandings: async (_, { legionId, userId, score }) => {
      const legion = await Legion.findById(legionId);
      if (!legion) {
        throw new Error('Legion not found');
      }

      const playerStanding = legion.standings.find(
        (standing) => standing.userId.toString() === userId
      );

      if (playerStanding) {
        playerStanding.totalScore += score;
      } else {
        legion.standings.push({ playerId, totalScore: score });
      }

      await legion.save();
      return legion.standings;
    },
  },
};

module.exports = resolvers;
