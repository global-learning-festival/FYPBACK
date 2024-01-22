const cluster = require('cluster');
const express = require('express');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config('.env');

const app = express();
const port = process.env.PORT || 5000;
const cCPUs = 1;

process.env.NODE_NO_WARNINGS = 1;

app.use(express.json());

const Authorization = () => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`;
  return encodeURI(authUrl);
};  

const Redirect = async (code) => {
  try {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code,
    };

    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`;

    const response = await axios.post(tokenUrl, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Process the response as needed (e.g., save the access token)
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error while exchanging code for access token:', error);
    return { success: false, error: error.message };
  }
};

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
