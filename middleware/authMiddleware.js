import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const requireAuth = (req, res, next) => {
  const token = req?.cookies?.jwt;
  //check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log("invalid jwt token - ", err.message);
        res.redirect("/login");
      } else {
        // console.log(" DecodedToken ", decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

export const checkUser = (req, res, next) => {
  const token = req?.cookies?.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
        //   console.log("invalid jwt token - ", err.message);
          res.locals.user = null;
          next();
        } else {
        //   console.log(" DecodedToken ", decodedToken);
          let user = await User.findById(decodedToken?.id);
        //   console.log("user found by id - ", user);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};
