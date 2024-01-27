//authHelper.js
const express = require('express');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();
const { URLSearchParams } = require('url');

const app = express();  // Create an Express app

const Authorization = () => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`;
  return encodeURI(authUrl);
};  

const Redirect = async (code, retryCount = 0, res) => {
  try {
    console.log('Starting Redirect function');

    const payload = { 
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code,
    };

    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken`;

    const response = await axios.post(tokenUrl, qs.stringify(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Log the successful token response for debugging
    console.log('Token Response:', response.data);

    // Request user profile data from LinkedIn
    const profileUrl = 'https://api.linkedin.com/v2/userinfo';
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    // Extract relevant user information
    const {
      name,
      sub,
    } = profileResponse.data;

    console.log('User Information:', profileResponse.data);

    const [first_name, last_name] = name.split(' ');
    const company = '';
    const uid = sub;

    try {
      // Check if the user with the given uid already exists
      const userExistsResult = await query('SELECT * FROM users WHERE uid = $1', [uid]);

      if (userExistsResult.rows.length > 0) {
        console.log('User already exists. Retrieving information:', response.data);
      } else {
        console.log('User information stored successfully:', response.data);

        // Check if the user with the given uid already exists
        const newUserResult = await query(
          'INSERT INTO users (first_name, last_name, company, uid) VALUES ($1, $2, $3, $4) RETURNING *',
          [first_name, last_name, company, uid]
        );

        console.log('New user added successfully:', newUserResult.rows[0]);
      }

      // Redirect after successful user handling
      if (res) {
        console.log('Redirecting to http://localhost:3000/editprofile');
        res.redirect('http://localhost:3000/editprofile');
        return; // Explicitly return to avoid further execution
      } else {
        console.log('No response object available for redirection');
        // Pass 'res' to the recursive call
        return await Redirect(code, retryCount + 1, res);
      }
    } catch (error) {
      console.error('Error in Redirect function:', error);
      if (res) {
        return res.status(500).json({ error: 'Error during redirection' });
      } else {
        // Handle the error as needed
        console.log('No response object available for redirection');
      }
      console.log('End of Redirect function due to error');
    }


    // Return success response with user data
    return {
      success: true,
      data: {
        access_token: response.data.access_token,
        user: {
          name: name,
          uid: sub,
        },
      },
    };
    
  } catch (error) {
    if (
      (error.code === 'ETIMEDOUT' || error.code === 'ENETUNREACH') &&
        retryCount < 3
    ) {
      // Retry the request after a short delay (e.g., 1000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Redirect(code, retryCount + 1, res);  // Pass 'res' to the recursive call
    } else {
      console.error('Error while exchanging code for access token:', error);

      // Check for specific error conditions
      if (error.response && error.response.data) {
        const { error: errorCode, error_description: errorDescription } =
          error.response.data;

        if (errorCode === 'invalid_request') {
          // Handle the specific 'invalid_request' error
          console.error('Invalid request error:', errorDescription);
        }
      }

      return { success: false, error: error.message };
    }
  }
};

//Use the Redirect function with the express response object
app.get('/api/linkedin/redirect', async (req, res) => {
  const code = req.query.code;
  await Redirect(code, 0, res);
});

module.exports = {
  Authorization,  
  Redirect,
  app,
};
