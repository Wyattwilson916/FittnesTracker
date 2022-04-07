const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
} = require("../db");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

require("dotenv").config();

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  // FIX THE ERROR HANDLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  console.log(req.body, "@#$%^&*")
  try {
    // check if username taken
    let _user = await getUserByUsername(username);
    if (_user) {
      res.status(401);
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      })
    } else if (password.length < 8) {
          res.status(401)
          next({response:"password-too-short", message:"Password too short"})
          // throw error
    } else {
      // create new user
      const user = await createUser({ username, password });
      res.send({ user });
    }
    next("Username already exists", );
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET
    );
    res.send({
      message: "You're logged in!",
      token,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    // res.send(user);
    console.log("Sent user data!!!")
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
