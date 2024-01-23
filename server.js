const cluster = require('cluster');
const express = require('express');
const axios = require('axios');
const {Authorization, Redirect } = require('./authHelper')
require('dotenv').config('.env');

const app = express();
const port = process.env.PORT || 5000;
const cCPUs = 1;

process.env.NODE_NO_WARNINGS = 1;

app.use(express.json());

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
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  app.get('/api/linkedin/authorize', (req, res) => {
    return res.redirect(Authorization());
  });

  app.get('/api/linkedin/redirect', async (req, res) => {
    const result = await Redirect(req.query.code);
    if (result.success) {
      // Assuming you want to send the data to the client on successful redirect
      return res.json(result.data);
    } else {
      return res.status(500).json({ error: result.error });
    }
  });
}
