const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  attachActivitiesToRoutines,
  getRoutineActivityByRoutineAndActivity,
} = require("../db");
const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id } = req.user;
  const routineObject = { creatorId: id, isPublic: isPublic, name, goal };
  try {
    const routine = await createRoutine(routineObject);
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { name, goal } = req.body;
  const { id } = req.user;
  const { routineId } = req.params;
  const updateObject = {};
  updateObject.id = routineId;
  if (typeof req.body.isPublic === "boolean") {
    const { isPublic } = req.body;
    updateObject.isPublic = isPublic;
  }
  if (name) {
    updateObject.name = name;
  }
  if (goal) {
    updateObject.goal = goal;
  }
  try {
    const checkRoutine = await getRoutineById(routineId);
    if (checkRoutine && checkRoutine.creatorId === id) {
      const routine = await updateRoutine(updateObject);
      res.send(routine);
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    const checkRoutine = await getRoutineById(routineId);
    if (checkRoutine && checkRoutine.creatorId === req.user.id) {
      const routine = await destroyRoutine(routineId);
      res.send(routine);
    }
  } catch (error) {
    next(error);
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    const routineActivitiesArray = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    const filteredRoutineActivities = routineActivitiesArray.filter((RA) => {
      return RA.activityId === activityId;
    });
    console.log(filteredRoutineActivities, "FILTERED");
    const checkRA = await getRoutineActivityByRoutineAndActivity(
      routineId,
      activityId
    );
    if (!checkRA && filteredRoutineActivities.length === 0) {
      const routineActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      if (routineActivity) {
        res.send(routineActivity);
      }
    } else {
      next({
        name: "RoutineActivityExistsError",
        message: `A routine_activity by that routineId ${routineId}, activityId ${activityId} combination already exists`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = routinesRouter;
