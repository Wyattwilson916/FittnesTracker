const express = require("express");
const routine_activitiesRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  getRoutineActivityByRoutineAndActivity,
} = require("../db");
const { requireUser } = require("./utils");

routine_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { routineId, activitiyId, count, duration } = req.body;
    const updateObj = { id: routineActivityId };
    if (count) {
      updateObj.count = count;
    }
    if (duration) {
      updateObj.duration = duration;
    }
    try {
      const checkDupe = await getRoutineActivityByRoutineAndActivity(
        routineId,
        activitiyId
      );
      console.log(checkDupe, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      if (!checkDupe) {
        const checkRoutine = await getRoutineById(routineId);
        const { creatorId } = checkRoutine;
        if (req.user.id === creatorId) {
          const updatedRA = await updateRoutineActivity(updateObj);
          res.send(updatedRA);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routine_activitiesRouter;
