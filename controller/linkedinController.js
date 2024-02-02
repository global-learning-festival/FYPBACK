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
    const profileUrl = "https://api.linkedin.com/v2/userinfo";
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Extract relevant user information
    const { sub, name, picture } = profileResponse.data;

    const [first_name, last_name] = name.split(" ");
    const profile_pic = picture;
    const uid = sub;

    try {
      // Check if the user with the given uid already exists
      const userExistsResult = await query(
        "SELECT * FROM users WHERE uid = $1",
        [uid]
      );

      if (userExistsResult.rows.length > 0) {
        console.log(
          "User already exists. Retrieving information:",
          response.data
        );
      } else {
        console.log(
          "User information stored successfully:",
          profileResponse.data
        );

        // Check if the user with the given uid already exists
        const newUserResult = await query(
          "INSERT INTO users (first_name, last_name, uid, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
          [first_name, last_name, uid, profile_pic]
        );

        console.log("New user added successfully:", newUserResult.rows[0]);
      }
    } catch (error) {}

    console.log("User Information:", profileResponse.data);
    //console.error("LinkedIn API Error:", profileResponse.data);

    return profileResponse.data;
  } catch (error) {
    //console.error("Error fetching user data:", error);
    throw error;
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

    const { sub, name, picture } = userData;

    const [first_name, last_name] = name.split(" ");
    const profile_pic = picture;
    const uid = sub;

    try {
      // Check if the user with the given uid already exists
      const userExistsResult = await query(
        "SELECT * FROM users WHERE uid = $1",
        [uid]
      );

      if (userExistsResult.rows.length > 0) {
        console.log("User already exists. Retrieving information:", userData);
      } else {
        console.log("User information stored successfully:", userData);

        // Check if the user with the given uid already exists
        const newUserResult = await query(
          "INSERT INTO users (first_name, last_name, uid, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
          [first_name, last_name, uid, profile_pic]
        );

        console.log("New user added successfully:", newUserResult.rows[0]);
      }
    } catch (error) {
      console.error("Error executing SQL query:", error);
    }
    return userData;
  } catch (error) {
    //console.error("Error fetching user data:", error);
    throw error;
  }
};
