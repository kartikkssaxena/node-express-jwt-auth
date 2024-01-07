//https://www.youtube.com/watch?v=SnoAwLP1a-0&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=1

import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

//added to work with env file
import dotenv from "dotenv";
import { requireAuth, checkUser } from "./middleware/authMiddleware.js";
dotenv.config();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = `mongodb+srv://${process.env.MONGO_ID}:${process.env.MONGO_PASSWORD}@cluster0.rv1wp.mongodb.net/node-auth`;

mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("listening at port 3000.");
    app.listen(3000);
  })
  .catch((err) => console.log("Error ---- /n", err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => {
  res.render("smoothies");
});
app.use(authRoutes);

// app.get("/set-cookies", (req, res, next) => {
//   // res.setHeader("Set-Cookie", "newUser=true").send("you got the cookie");
//   res.cookie("newUser", false);
//   res.cookie(
//     "details",
//     { uername: "kartik", password: "fjkdhfdjs" },
//     { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
//   );
//   res.send("cookie sent!");
// });

// app.get("/read-cookies", (req, res, next) => {
//   const coookies = req.cookies;
//   console.log(coookies);
//   res.json(coookies);
// });
