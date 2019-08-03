var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
      
var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  avatar: String,
  //this will be used to reset the password 
  //resetPasswordToken: String,
  //resetPasswordExpires: Date,
  isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
