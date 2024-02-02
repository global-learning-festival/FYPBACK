const cluster = require("cluster");
const express = require("express");
const app = require("./app");
const axios = require("axios");
const { Authorization, Redirect } = require("./authHelper");
const cors = require("cors");

app.use(cors());
require("dotenv").config(".env");

const port = process.env.PORT || 5000;
const cCPUs = 1;

process.env.NODE_NO_WARNINGS = 1;

if (cluster.isMaster) {
  // Create a worker for each CPU
  for (let i = 0; i < cCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log("Worker " + worker.process.pid + " is online.");
  });

  cluster.on("exit", function (worker, code, signal) {
    console.log("Worker " + worker.process.pid + " died.");
  });
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  app.get("/api/linkedin/authorize", (req, res) => {
    return res.redirect(Authorization());
  });

  app.get("/api/linkedin/redirect", async (req, res) => {
    return res.json(Redirect(req.query.code));
  });

  app.post("/adduser", (req, res) => {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var company = req.body.company;
    var uid = req.body.uid;

    // Check if the user exists in the database
    User.getUserByUid(uid, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking user existence");
      } else {
        if (result.length > 0) {
          // User already exists, you can handle this case accordingly
          console.log("User already exists. Retrieving information:", result);
          res.status(200).send("User already exists");
        } else {
          // User does not exist, insert into the database
          User.addUser(first_name, last_name, company, uid, (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error inserting user data");
            } else {
              console.log("User information stored successfully:", result);
              res.status(201).send("User information stored successfully");
            }
          });
        }
      }
    });
  });
}
