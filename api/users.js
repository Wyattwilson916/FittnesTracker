const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getPublicRoutinesByUser,
} = require("../db");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // check password length
    if (password.length >= 8) {
      let _user = await getUserByUsername(username);
      // check if username taken
      if (!_user) {
        const user = await createUser({ username, password });
        res.send({ user });
      } else {
        next({ name: "UsernameTaken", message: "Username already exists" });
      }
    } else {
      next({ name: "PasswordTooShort", message: "Password too short" });
    }
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
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  try {
    const routines = await getPublicRoutinesByUser({ username });
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
