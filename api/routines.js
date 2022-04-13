const express = require("express");
// establishes routes for routines
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  getRoutineActivityByRoutineAndActivity,
} = require("../db");
const { requireUser } = require("./utils");

// gets all public routines
routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

// creates and returns routine
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id } = req.user;
  // build update object using req.body and req.user
  const routineObject = { creatorId: id, isPublic: isPublic, name, goal };
  try {
    const routine = await createRoutine(routineObject);
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// update route for specific routine, if user is author
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { name, goal } = req.body;
  const { id } = req.user;
  const { routineId } = req.params;
  // builds update object if parameters are supplied
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
    // checks if routine exists and if user is the author of routine
    const checkRoutine = await getRoutineById(routineId);
    if (checkRoutine && checkRoutine.creatorId === id) {
      // updates and returns routine
      const routine = await updateRoutine(updateObject);
      res.send(routine);
    }
  } catch (error) {
    next(error);
  }
});

// deletes routine if user is the author of routine
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  try {
    // check if user is the routine's creator
    const checkRoutine = await getRoutineById(routineId);
    if (checkRoutine && checkRoutine.creatorId === req.user.id) {
      // deletes routine and associated routineActivities
      const routine = await destroyRoutine(routineId);
      res.send(routine);
    }
  } catch (error) {
    next(error);
  }
});

// adds activity to routine
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  try {
    // get array of all routineActivities with common routine
    const routineActivitiesArray = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    // filters array based on activityId, if new array has 0 length, routineActivity does not exist yet
    const filteredRoutineActivities = routineActivitiesArray.filter((RA) => {
      return RA.activityId === activityId;
    });
    // double check to make sure routineActivity with stated routineId and activityId does not exist
    const checkRA = await getRoutineActivityByRoutineAndActivity(
      routineId,
      activityId
    );
    if (!checkRA && filteredRoutineActivities.length === 0) {
      // finally create routineActivity object, connecting activity to routine
      const routineActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      if (routineActivity) {
        // if it comes back correctly, send routineActivity object
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
