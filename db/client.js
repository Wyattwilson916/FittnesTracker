// build and export your unconnected client here
const { Client } = require("pg");
const connection = "postgres://localhost:5432/fitness-dev";

const client = new Client(connection);

module.exports = client;
