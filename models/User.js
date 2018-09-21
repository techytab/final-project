let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
  email : String,
  passwordHash : String,
  salt: String,
  firstName : String,
  lastName : String,
  userName: String
});

// let UserSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true
//   },
//   lastName: {
//     type: String,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   userName: {
//     type: String,
//     unique: true
//   },
//   passwordHash: {
//     type: String,
//     required: true,
//     salt: String
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   _id: {
//     type: Number,
//     autoIncrement: true
//   }
// });

UserSchema.method("setPassword", function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
});

UserSchema.method("validatePassword", function(password){
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
  return (hash === this.passwordHash);
});

UserSchema.method("generateJWT", function(){
  return jwt.sign({
    id:this._id,
    email: this.userName,
  }, 'SecretKey');
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
