// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/health", (req, res, next) => {
  res.send({ message: "All is well." });
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
