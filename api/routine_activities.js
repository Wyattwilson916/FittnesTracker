const express = require("express");
// establish specific router for routine_activities routes
const routine_activitiesRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  canEditRoutineActivity,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

// update route for routineActivities
routine_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    // pulls id from url and count and duration from req.body
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    // pulls routineActivity object to check if user is authorized to edit
    const routineActivityToUpdate = getRoutineActivityById(routineActivityId);
    try {
      // if it doesn't exist
      if (!routineActivityToUpdate) {
        next({
          name: "RoutineActivityToUpdateERR",
          message: "Routine activity to update does not exist",
        });
        // if the user is not the creater of the associated routine
      } else if (
        !(await canEditRoutineActivity(routineActivityId, req.user.id))
      ) {
        res.status(403);
        next({
          name: "UnauthorizedUser",
          message: "Unable to edit routine activity",
        });
        // otherwise, update the routineActivity
      } else {
        res.send(
          await updateRoutineActivity({
            id: routineActivityId,
            count,
            duration,
          })
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// deletes a routineActivity, severing the connection between routine and activity
routine_activitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
      // check if user is authorized to edit/delete
      const check = await canEditRoutineActivity(
        routineActivityId,
        req.user.id
      );
      // if authorized, proceed, else pass on without doing anything
      if (check) {
        const routineActivity = await destroyRoutineActivity(routineActivityId);
        res.send(routineActivity);
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routine_activitiesRouter;
