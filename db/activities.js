const client = require("./client")

async function createActivity({ name, description }){
    try {
        const { rows: [activity] } = await client.query(`
            INSERT INTO activities (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `, [name, description]);
        return activity
    } catch (error) {
        console.error('Problem creating activity...', error)
    }
}

async function getAllActivities(){
    try {
        const { rows: activities } = await client.query(`
            SELECT *
            FROM activities;
        `);
        return activities
    } catch (error) {
        console.error('Problem returning activities', error)
    }
}

async function updateActivity({id, name, description}){
    const fields = {name, description}
    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
    try {
        const { rows: [activity] } = await client.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
        return activity
    } catch (error) {
        console.error('Problem updating activities', error)
    }
}



module.exports = {
    createActivity,
    getAllActivities,
    updateActivity,
}