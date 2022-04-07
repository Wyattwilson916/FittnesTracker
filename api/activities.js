const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, createActivity } = require("../db");
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

module.exports = activitiesRouter;
