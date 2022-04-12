const express = require("express");
const routine_activitiesRouter = express.Router();
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  getRoutineActivityByRoutineAndActivity,
  canEditRoutineActivity,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

routine_activitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivityToUpdate = getRoutineActivityById(routineActivityId);
    try {
      if (!routineActivityToUpdate) {
        next({
          name: "RoutineActivityToUpdateERR",
          message: "Routine activity to update does not exist",
        });
      } else if (
        !(await canEditRoutineActivity(routineActivityId, req.user.id))
      ) {
        res.status(403);
        next({
          name: "UnauthorizedUser",
          message: "Unable to edit routine activity",
        });
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

// routine_activitiesRouter.delete(
//   "/:routineActivityId",
//   requireUser,
//   async (req, res, next) => {
//     const { routineActivityId } = req.params;
//     const checkRoutineActivity = await getRoutineActivityById(
//       routineActivityId
//     );
//     try {
//       if (
//         checkRoutineActivity &&
//         checkRoutineActivity.creatorId === req.user.id
//       ) {
//         const routineActivity = await destroyRoutineActivity(routineActivityId);
//         res.send(routineActivity);
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

/* THIS NEEDS HELP ^^^^^ */

module.exports = routine_activitiesRouter;
