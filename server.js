
const cluster = require('cluster');
const express = require('express');
var bodyParser = require('body-parser')
const { Authorization, Redirect } = require("./authHelper");
require('dotenv').config('.env');

var port = process.env.PORT || 5000;
var cCPUs = 1;

process.env.NODE_NO_WARNINGS = 1;

if (cluster.isMaster) {
    // Create a worker for each CPU
    for (let i = 0; i < cCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died.');
    });
} else {
    var app = express();
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.listen(port);

    app.get('/api/linkedin/authorize', (req, res) => {
      return res.redirect(Authorization());
    });
    
    app.get('/api/linkedin/redirect', async (req, res) => {
      return res.json(Redirect(req.query.code));
    });
}