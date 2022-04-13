const client = require("./client");

// // used as helper function when routineActivity object needed
async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
          SELECT * FROM routine_activities
          WHERE id=${id};
        `);
    return routine_activity;
  } catch (error) {
    console.error("Problem getting routine activity by id", error);
  }
}

// creates link between existing routine and activity by adding to through table
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
            INSERT INTO routine_activities ("routineId", "activityId", count, duration)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `,
      [routineId, activityId, count, duration]
    );
    return routine_activity;
  } catch (error) {
    console.error("Problem creating routine_activity...", error);
  }
}

// used to update count and/or duration of routineActivity
async function updateRoutineActivity({ id, count, duration }) {
  const fields = { count, duration };
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
        `,
      Object.values(fields)
    );
    return routineActivity;
  } catch (error) {
    console.error("Problem updating routineActivity", error);
  }
}

// used to verify whether the user trying to edit routineActivity is the author of routine
async function canEditRoutineActivity(routineActivityId, userId) {
    const {rows: [routineFromRoutineActivity]} = await client.query(`
        SELECT * FROM routine_activities
        JOIN routines ON routine_activities."routineId" = routines.id
        AND routine_activities.id = $1
      `, [routineActivityId]);
      return routineFromRoutineActivity.creatorId === userId;
  }

// deletes routineActivity, severing the connection between routine and activity
async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
        DELETE FROM routine_activities
        WHERE id=${id}
        RETURNING *;
        `);
    console.log("Finished deleting routineActivity!");
    return routine_activity;
  } catch (error) {
    console.error("Problem deleting routineActivity...", error);
  }
}

// returns an array of RAs based on routine id
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activites } = await client.query(`
          SELECT * FROM routine_activities
          WHERE "routineId"=${id};
        `);
    return routine_activites;
  } catch (error) {
    console.error("Problem getting routine activities", error);
  }
}

// returns an RA object based on routine id and activity id
async function getRoutineActivityByRoutineAndActivity(routineId, activityId) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(`
            SELECT * FROM routine_activities
            WHERE "routineId"=${routineId}
            AND "activityId"=${activityId};
        `);
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
  getRoutineActivityByRoutineAndActivity,
  canEditRoutineActivity,
};
