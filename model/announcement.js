require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const announcement = {
   
   
    addannouncement: function(title , description, callback) {
        return query(`INSERT INTO announcements ( title , description) VALUES ($1, $2) RETURNING*`, [title , description]).then((result,err) =>{
    
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

    getannonucement: function( callback) {
        return query(`SELECT title , description FROM announcements`).then((result,err) =>{
    
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







       
                
module.exports = announcement