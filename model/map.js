require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const map = {
  //Adds a marker to the map
  addmarker: function (
    location_name,
    category,
    description,
    coordinates,
    image,
    callback
  ) {
    return query(
      `INSERT INTO marker (location_name, category, description, coordinates, image) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
      [location_name, category, description, coordinates, image]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Retrieves all marker details
  getmarker: function (callback) {
    return query(
      `SELECT mapid, location_name, category, description, coordinates, image FROM marker`
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets individual marker details
  getmarkerindiv: function (mapid, callback) {
    return query(
      `SELECT mapid, location_name, category, description, coordinates, image FROM marker where mapid = $1 `,
      [mapid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //To update the details of an edited marker
  updatemarker: function (
    mapid,
    location_name,
    category,
    description,
    image,
    callback
  ) {
    return query(
      "UPDATE marker SET location_name = $2, category = $3, description = $4 , image = $5 WHERE mapid = $1 RETURNING *",
      [mapid, location_name, category, description, image]
    )
      .then(result=> {
        return callback(null, result);
      
    }).catch(error=>{
      return callback(error, null);
  
    });
  },
  //Removes a marker from the db
  deletemarker: function (mapid, callback) {
    return query(
      `DELETE FROM marker WHERE mapid=$1`,
      [mapid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
};

module.exports = map;
