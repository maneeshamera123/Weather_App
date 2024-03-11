const mongoose=require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  });

module.exports = mongoose.model('token',tokenSchema);