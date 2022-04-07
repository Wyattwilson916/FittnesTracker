const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    throw new Error("Password too short");
  }
  try {
    // check if username taken
    let _user = await getUserByUsername(username);
    if (_user.id) {
      throw new Error("Username already exists");
    }
    // create new user
    const user = await createUser({ username, password });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
