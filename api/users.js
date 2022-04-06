const express = require("express");
const usersRouter = express.Router();
const { createUser } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    throw new Error("Password too short");
  }
  try {
    const user = await createUser({ username, password });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
