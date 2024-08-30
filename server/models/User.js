const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const Legion = require("./Legion"); // Import the Legion model

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    numVotes: {
      type: Number,
      default: 0,
    },
    numSongs: {
      type: Number,
      default: 0,
    },
    numLegions: {
      type: Number,
      default: 0,
    },
    numVictories: {
      type: Number,
      default: 0,
    }
  },
  {
    toJSON: { virtuals: true }, // Ensure virtuals are included in toJSON output
    toObject: { virtuals: true },
  }
);

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("age").get(function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

userSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

userSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getFilter());
  if (docToDelete) {
    // Remove the user from all legions' players array
    await Legion.updateMany(
      { players: docToDelete._id },
      { $pull: { players: docToDelete._id } }
    );
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;