import User from "../models/userModel.js";
import { createAuthToken, handleErrors } from "../utils.js";
import { max_age } from "../CONSTANTS.js";

export const signup_get = (req, res, next) => {
  res.render("signup");
};

export const login_get = (req, res, next) => {
  res.render("login");
};

export const signup_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const newUser = new User({
      email: email,
      password: password,
    });
    let userSaveResult = await newUser.save();

    let token = createAuthToken(userSaveResult?._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: max_age });
    res.status(201).json({ user: userSaveResult._id });
  } catch (error) {
    res.status(400).json({ errors: handleErrors(error) });
  }
};

export const login_post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    let token = createAuthToken(user?._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: max_age });
    res.status(200).json({ user: user?._id });
  } catch (error) {
    res.status(400).json({ errors: handleErrors(error) });
  }
};

export const logout_get = async (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
