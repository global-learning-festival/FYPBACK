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
        return query(`SELECT title, description, TO_CHAR(created_at, 'DD/MM/YYYY ,HH12:MIam') AS "created_on", TO_CHAR(updated_at, 'DD/MM/YYYY ,HH12:MIam') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },

    updateAnnouncement: function(announcementid, title, description, callback) {
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
    
   



}







       
                
module.exports = announcement