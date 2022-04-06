const client = require("./client")

async function createRoutine({ creatorId, isPublic, name, goal }){
    try {
        const { rows: [routine] } = await client.query(`
            INSERT INTO routines ("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);
        return routine
    } catch (error) {
        console.error('Problem creating routines...', error)
    }
}
// async function getRoutineById(id){

// }
async function getRoutinesWithoutActivities(){
    try {
        const { rows: routines } = await client.query(`
            SELECT *
            FROM routines;
        `);
        return routines
    } catch (error) {
        console.error('Problem returning routines w/o activities', error)
    }
}




module.exports = {
    createRoutine,
    getRoutinesWithoutActivities,
}