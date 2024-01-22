const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const Authorization = () => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`;
  return encodeURI(authUrl);
};  

const Redirect = async (code, retryCount = 0) => {
  try {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code,
    };

    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`;

    const response = await axios.post(tokenUrl, qs.stringify(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Request user profile data from LinkedIn
    const profileUrl = 'https://api.linkedin.com/v2/userinfo';
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });

    // Extract relevant user information
    const { localizedFirstName, localizedLastName, emailAddress } = profileResponse.data;

    // Return success response with user data
    return {
      success: true,
      data: {
        access_token: response.data.access_token,
        user: {
          firstName: localizedFirstName,
          lastName: localizedLastName,
          email: emailAddress,
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
      return Redirect(code, retryCount + 1);
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

module.exports = {
  Authorization,  
  Redirect,
};
