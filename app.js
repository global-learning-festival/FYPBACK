const express = require('express');
const cors = require('cors');
//const multer = require("multer");
const path = require("path");




//////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////
const app = express();


const bodyParser=require('body-parser');
//const pool = require('./db'); //Import from db.js



//const jwt = require("jsonwebtoken");
//const JWT_SECRET = require("./config"); 
//const { user, password } = require('pg/lib/defaults');





//////////////////////////////////////////////////////
// SETUP APP    
//////////////////////////////////////////////////////
app.use(cors());

// REQUIRED TO READ POST>BODY
// If not req.body is empty
app.use(express.urlencoded({ extended: false}));
app.use(express.json())
app.use(bodyParser.json()); 

app.get('/route', async (req, res) => {
    try {
      const start = req.query.start; // Start location (e.g., '1.319728,103.8421')
      const end = req.query.end; // End location (e.g., '1.319728905,103.8421581')
      const routeType = req.query.routeType || 'walk'; // Specify routeType if needed
  
      // Make a request to the OneMap API
      const response = await axios.get(
        `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${start}&end=${end}&routeType=${routeType}`,
        {
          headers: {
            Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4YmYzMDFhZWQ2NzY3NjJkZWQxZTgzYTQ0MWU5ODA1OCIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC0xMjIzNjk4OTkyLmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL2FwaS92Mi91c2VyL3Bhc3N3b3JkIiwiaWF0IjoxNjk4MTE1MDMxLCJleHAiOjE2OTgzNzQyMzEsIm5iZiI6MTY5ODExNTAzMSwianRpIjoiMFRiTURPc2h0b1ZoOHZDOCIsInVzZXJfaWQiOjEzNjMsImZvcmV2ZXIiOmZhbHNlfQ.VU24uLUE0XPAsr-ZGfuDLeheqWfqqz3eDVVyaRRvE8o', // Replace with your OneMap API key
          },
        }
      );
  
      // Return the response from the OneMap API to the client
      res.json(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  