const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide FirstName'],
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide lastName'],
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  isDeleted:{
    type: Boolean,
    default: false
  }
});

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcrypt.compare(canditatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);