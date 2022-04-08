const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const activity = await createActivity({ name, description });
    res.send(activity);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
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
