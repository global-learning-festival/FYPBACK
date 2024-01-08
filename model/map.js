require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")

const sizeOf = require('image-size');
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
   
    updatemarker: function(announcementid, title, description, callback) {
        return query(`UPDATE announcements SET title = $1, description = $2 WHERE announcementid = $3 RETURNING *`, [title, description, announcementid])
            .then((result, err) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
                    callback(null, result);
                }
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
    
   



}







       
                
module.exports = map