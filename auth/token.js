// import packages
const jwt = require('jsonwebtoken');
const express = require('express');
const dotenv = require('dotenv');

// load environment variables
dotenv.config();

// create express app
const app = express();

// use json middleware
app.use(express.json());

// generate a secret key
const secret = require('crypto').randomBytes(64).toString('hex');

// store the secret in the .env file
process.env.TOKEN_SECRET = secret;

// create a function to generate access tokens
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

// create a route to authenticate a user and return a token
app.post('/api/login', (req, res) => {
  // get the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // validate the credentials
  // this is just a mock example, you should use a database or a service to verify the user
  if (username === 'admin' && password === 'password') {
    // generate an access token
    const token = generateAccessToken({ username: username });

    // send the token in the response
    res.json({ token: token });
  } else {
    // send an error message
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// create a middleware function to verify the token
function authenticateToken(req, res, next) {
  // get the token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // if there is no token, return an error
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // verify the token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // if the token is invalid, return an error
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // if the token is valid, set the user in the request object and call the next middleware
    req.user = user;
    next();
  });
}

// create a route to get some data that requires authentication
app.get('/api/data', authenticateToken, (req, res) => {
  // send some data in the response
  res.json({ data: 'This is some secret data' });
});

// start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});