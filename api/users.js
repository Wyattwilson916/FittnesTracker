const express = require("express");
// establishes router for users routes
const usersRouter = express.Router();
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
  getPublicRoutinesByUser,
} = require("../db");

// pulls in jwt to require tokens
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

// create user route
usersRouter.post("/register", async (req, res, next) => {
  // pulls from req.body
  const { username, password } = req.body;

  try {
    // check password length
    if (password.length >= 8) {
      let _user = await getUserByUsername(username);
      // check if username taken
      if (!_user) {
        // if user not taken, create user
        const user = await createUser({ username, password });
        // create token
        const token = jwt.sign(
          {
            id: user.id,
            username,
          },
          process.env.JWT_SECRET
        );
        // send back success message, token, and user object
        res.send({ message: "Successfully created a new user", token, user });
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

// verifies existing user
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // get user object
    const user = await getUser({ username, password });
    // create token
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET
    );
    // send back success message, token, and user object
    res.send({
      message: "You're logged in!",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// get user object by id
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

// get routines by username
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
