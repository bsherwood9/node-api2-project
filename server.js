const express = require("express");
const dbRouter = require("./data/router/db-router.js");
const server = express();

server.use(express.json());
server.use("/api", dbRouter);

//endpoints
server.get("/", (req, res) => {
  res.send(
    `<h1>This is Brett's Router Project</h1>
        <p>Let's do this thing!</p>`
  );
});

module.exports = server;
