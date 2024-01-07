import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
import { max_age, LOGIN_VALIDATION_FAILED_MESSAGE } from "./CONSTANTS.js";


export const handleErrors = (err) => {
  let errorsObj = {};

  //Duplicate error code
  if (err?.code === 11000) {
    errorsObj.email = "Email already is already registered.";
  }

  //Validation error
  if (err.message.includes("User validation failed")) {
    Object.values(err?.errors).forEach(({ properties }) => {
      errorsObj[properties?.path] = properties?.message;
    });
  }

  if (err?.message === LOGIN_VALIDATION_FAILED_MESSAGE.PASSWORD) {
    errorsObj.password = err?.message;
  }
  if (err?.message === LOGIN_VALIDATION_FAILED_MESSAGE.EMAIL) {
    errorsObj.email = err?.message;
  }

  return errorsObj;
};

export const verifyPassword = (userPassword, hashedPasswordfromDB) =>
  passwordHash.verify(
    process.env.PASSWORD_SECRET_KEY + userPassword,
    hashedPasswordfromDB
  );

export const getHashedPassword = (password) => {
  password = process.env.PASSWORD_SECRET_KEY + password;
  let hashedPassword = passwordHash.generate(password, { saltLength: 8 });
  return hashedPassword;
};

export const createAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: max_age,
  });
};
