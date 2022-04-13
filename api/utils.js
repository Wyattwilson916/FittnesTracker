// acts as middleware to require a req.user, i.e. someone needs to be logged in
function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser,
  };
  