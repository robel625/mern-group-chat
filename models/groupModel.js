const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    groupname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    avatar: {
      type: String,
      default: 'male.png',
    },
    story: {
      type: String,
      default: '',
      maxlength: 200,
    },
    text: String,
    media: Array,

    user: { type: mongoose.Types.ObjectId, ref: 'user' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('group', groupSchema);
