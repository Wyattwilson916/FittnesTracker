const { use } = require("bcrypt/promises");
const client = require("./client")

async function createUser({ username, password }){
    //hash password before storing to DB
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING *;
        `, [username, password]);
        delete user.password
        return user
    } catch (error) {
        console.error('Problem creating user...', error)
    }
}

async function getUser({ username, password }) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username = $1
            AND password = $2;
        `,[username, password]);
        delete user.password
        return user
    } catch (error) {
        console.error('Problem getting user...')
        
    }
}

async function getUserById(id){
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id = $1;
        `, [id]);
        return user
    } catch (error) {
        console.error("Problem get user by id...", error)
    }
}

async function getUserByUsername(username){
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username = $1;
        `, [username]);
        return user
    } catch (error) {
        console.error("Problem get user by username...", error)
    }
}



module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}