const express = require("express");
// establish activities routes
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// get all activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// create new activity, if logged in
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const activity = await createActivity({ name, description });
    res.send(activity);
  } catch (error) {
    next(error);
  }
});

// update activity, if logged in
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  // build update object, if parameters exist
  const updateObject = {};
  updateObject.id = activityId;
  if (name) {
    updateObject.name = name;
  }
  if (description) {
    updateObject.description = description;
  }
  try {
    const activity = await updateActivity(updateObject);
    res.send(activity);
  } catch (error) {
    next(error);
  }
});

// get all routines that share an activity
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  const idObject = { id: activityId };
  try {
    const activityRoutines = await getPublicRoutinesByActivity(idObject);
    res.send(activityRoutines);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
