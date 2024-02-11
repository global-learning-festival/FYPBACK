const express = require('express');
const axios = require('axios');
const router = express.Router();
require("dotenv").config();

router.get('/getDirections', async (req, res) => {
    try {
      const { startCoordinates, endCoordinates } = req.query; // Use req.query instead of req.params
       const apiKey = process.env.GOOGLEMAPSAPI;
   
  
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoordinates}&destination=${endCoordinates}&mode=walking&key=${apiKey}`;
  
      const response = await axios.get(apiUrl);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching directions:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
