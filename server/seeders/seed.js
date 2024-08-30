const db = require('../config/connection');
const { User, Workout } = require('../models');
const userSeeds = require('./userSeeds.json');
const workoutSeeds = require('./workoutSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Workout', 'workouts');

    await cleanDB('User', 'users');

    await User.create(userSeeds);

     for (let i = 0; i < workoutSeeds.length; i++) {
      const { _id, userId } = await Workout.create(workoutSeeds[i]);
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { workouts: _id } }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
