const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  description: { type: String },
  taskCompleted: { type: Boolean, default: false },
});

const CheckPointSchema = new Schema(
  {
    focusArea: {
      type: String,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [taskSchema],
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkpointCompleted: { type: Boolean, default: false },
    completedAt: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const CheckPoint = model('CheckPoint', CheckPointSchema);
module.exports = CheckPoint;