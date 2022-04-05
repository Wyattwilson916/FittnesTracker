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
    try {
        const { rows: [activity] } = await client.query(`
            UPDATE activities
            SET 
            WHERE id=$1
        `)
        //!@#$%^&*()(*&^%$#@#$%^&*&^%$#@!@#$%^)#$%^&^%$#$%^&^%$#%^%$#$%
        //FINISH THIS
    } catch (error) {
        
    }
}



module.exports = {
    createActivity,
    getAllActivities,
}