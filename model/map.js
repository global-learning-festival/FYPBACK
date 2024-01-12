require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const map = {
   

   
    addmarker: function(location_name, category, description, coordinates, callback) {
        return query(`INSERT INTO marker (location_name, category, description, coordinates) VALUES ($1, $2, $3, $4) RETURNING*`,[location_name, category, description, coordinates]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                console.log(err)
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    

    
    getmarker: function( callback) {
        return query(`SELECT mapid, location_name, category, description, coordinates FROM marker`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },

     
    getmarkerindiv: function( mapid, callback) {
        return query(`SELECT mapid, location_name, category, description, coordinates FROM marker where mapid = $1 `, [mapid]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },

    updatemarker: function (mapid, location_name, category, description, callback) {
        return query(
          'UPDATE marker SET location_name = $2, category = $3, description = $4  WHERE mapid = $1 RETURNING *',
          [mapid, location_name, category, description]
        )
          .then((result, err) => {
            if (err) {
              callback(err, null);
              console.log(err);
              return;
            } else {
              return callback(null, result);
            }
          })
          .catch((error) => {
            console.error('Error updating marker:', error);
            return callback(error, null);
          });
      },

    

  

    retrieveImage: function(mapid, callback) {
        return query(`select image from marker where mapid = $1`, [mapid]).then((results,error) =>{
    
            if (error) {
                return callback(error, null);
              }
              
              return callback(null, results.rows[0]);
        });
    },

    deletemarker: function (mapid, callback) {
        return query(`DELETE FROM marker
        WHERE mapid=$1`,
        [mapid])
        .then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },

   
    
   



}







       
                
module.exports = map