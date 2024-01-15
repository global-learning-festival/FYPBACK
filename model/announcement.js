require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const announcement = {
   
   
    addAnnouncement: function(title , description, imageid, callback) {
        return query(`INSERT INTO announcements ( title , description, image) VALUES ($1, $2, $3) RETURNING*`, [title , description, imageid]).then((result,err) =>{
    
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

    getAnnouncements: function(callback) {
        return query(`SELECT announcementid, title, description, TO_CHAR(created_at, 'DD/MM/YYYY ,HH12:MIam') AS "created_on", TO_CHAR(updated_at, 'DD/MM/YYYY ,HH12:MIam') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    getAnnouncementById: function(announcementid, callback) {
        return query(`SELECT announcementid, title, description, image, TO_CHAR(created_at, 'DD/MM/YYYY ,HH12:MIam') AS "created_on", TO_CHAR(updated_at, 'DD/MM/YYYY ,HH12:MIam') AS "updated_on" FROM announcements WHERE announcementid = $1;`, [announcementid]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    updateAnnouncement: function(announcementid, title, description, image, callback) {
        return query(`UPDATE announcements SET title = $1, description = $2, image = $3 WHERE announcementid = $4 RETURNING *`, [title, description, image, announcementid])

            .then((result, err) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
                    callback(null, result);
                }
            });
    },
       deleteAnnouncement: function(announcementid, callback) {
        return query(`DELETE FROM announcements WHERE announcementid = $1;`, [announcementid]).then((result,err) =>{
    
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