require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const events = {
   
    addEvent: function (title, image_banner, location, keynote_speaker, description, survey_link, callback) {
        return query(`INSERT INTO events (title, image_banner, location, keynote_speaker, description, survey_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*`, [title, image_banner, location, keynote_speaker, description, survey_link]).then((result,err) =>{
    
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

    getEvents: function (callback) {
        return query(`SELECT eventid, title, image_banner, TO_CHAR(time_start, 'DD/MM/YYYY, HH12:MIam') AS "time_start", TO_CHAR(time_end, 'DD/MM/YYYY, HH12:MIam') AS "time_end", location, keynote_speaker, description, survey_link FROM events`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    getEventbyId: function (eventid, callback) {
        return query('SELECT * FROM events WHERE eventid = $1', [eventid])
            .then((result, err) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                    return;
                } else {
                    console.log(result);
                    callback(null, result);
                }
            });
    },
}
           
module.exports = events;