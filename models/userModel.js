import mongoose from "mongoose";
import validator from "validator";
import { getHashedPassword, verifyPassword } from "../utils.js";
import { LOGIN_VALIDATION_FAILED_MESSAGE } from "../CONSTANTS.js";


const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// Using mongoose hooks
// fire a fuction after doc asved to db
userSchema.post("save", function (doc, next) {
  // console.log("new user was created and saved", doc);
  next();
});

//fire a function before doc asved to db
userSchema.pre("save", function (next) {
  // console.log("user about to be created and saved", this, this.password);
  this.password = getHashedPassword(this.password);
  next();
});

//static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  
  if (user) {
    if (verifyPassword(password, user?.password)) {
      return user;
    } else {
      throw Error(LOGIN_VALIDATION_FAILED_MESSAGE.PASSWORD);
    }
  } else {
    throw Error(LOGIN_VALIDATION_FAILED_MESSAGE.EMAIL);
  }
};

export default mongoose.model("User", userSchema);
