// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
// establish api routes
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db");

// middleware to create req.user
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  // if no Authorization header, pass on by
  if (!auth) {
    next();
    // if Authorization header exists, pull token from header
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      // verify token matches 
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        // set req.user with user object
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// test route to check status of api
apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "All is well." });
});

// pulls usersRouters and establishes routes at api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// pulls activitiesRouters and establishes routes at api/activities
const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

// pulls routinesRouters and establishes routes at api/routines
const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

// pulls routine_activitiesRouters and establishes routes at api/routine_activities
const routine_activitiesRouter = require("./routine_activities");
apiRouter.use("/routine_activities", routine_activitiesRouter);

module.exports = apiRouter;
