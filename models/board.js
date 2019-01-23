const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
const replySchema = new Schema({
    text: {
      type: String,
      required: true
    },
    reported: {
      type: Boolean,
      default: false
    },
    delete_password: {
      type: String,
      required: true
    }
}, {
    timestamps: true
});


//_id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array)
const threadSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    reported: {
      type: Boolean,
      default: false
    },
    delete_password: {
      type: String,
      required: true
    },
    replies: [replySchema]
}, {
    timestamps: true
});


const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  threads: [threadSchema]
});


const Boards = mongoose.model('Board', boardSchema);

module.exports = Boards;