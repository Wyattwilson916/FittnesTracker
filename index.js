// create the express server here
const express = require("express");
const cors = require("cors");
const server = express();
const PORT = 3000;
const morgan = require("morgan");
const bodyParser = require("body-parser");

server.use(morgan("dev"));
server.use(cors());

server.use(bodyParser.json());

const apiRouter = require("./api");
server.use("/api", apiRouter);

const client = require("./db/client");

client.connect();
server.listen(PORT, () => {
  console.log(`Server is listening at localhost:${PORT}`);
});
