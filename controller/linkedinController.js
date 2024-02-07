//backend linkedinController
require("dotenv").config();
const axios = require("axios");
const qs = require("querystring");
const { Pool } = require("pg");

// Create a PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 5,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Define the query function
const query = async (text, values) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, values);
    return result;
  } finally {
    client.release();
  }
};

const getUserData = async (accessToken) => {
  console.log("getuserdata log:  " + accessToken);
  try {
    const profileUrl = "https://api.linkedin.com/v2/me";
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000000, // Adjust the timeout value as needed
    });

    console.log("User Information:", profileResponse.data);
    //console.error("LinkedIn API Error:", profileResponse.data);

    return profileResponse.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle token revocation, e.g., clear session
      //console.error("Token has been revoked by the user. Please reauthorize.");
      // Clear session information (example)
      // clearSession();
    } else {
      //console.error("Error fetching user data:", error);
      throw error;
    }
  }
};

exports.exchangeToken = async (code) => {
  try {
    const payload = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
    };
    console.log(JSON.stringify(payload));

    const tokenUrl = `https://www.linkedin.com/oauth/v2/accessToken`;

    const response = await axios.post(tokenUrl, qs.stringify(payload), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    console.log(`Access Token: ${accessToken}`);
    const userData = await getUserData(accessToken);
    console.log(`user Data: ${JSON.stringify(userData)}`);

    return userData;
  } catch (error) {
    //console.error("Error fetching user data:", error);
    throw error;
  }
};
