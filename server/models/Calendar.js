const { Schema, model } = require('mongoose');


const CalendarSchema = new Schema(
  {
    scheduleDate:  {
        type:Date, 
        required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    officeLocation: {type: String},
    checkpointAssigned: {type: String}
  }
);


const Calendar = model('Calendar', CalendarSchema);
module.exports = Calendar;