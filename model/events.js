require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const events = {

    addEvent: function (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link, callback) {
        if (typeof callback !== 'function') {
            console.error('Callback is not a function.');
            return Promise.reject('Callback is not a function.');
        }

        // Function to format datetime strings
        const formatDateTime = (datetime) => {
            if (datetime === undefined || datetime === null) {
                throw new Error('Datetime string is undefined or null.');
            }

            const parsedDateTime = new Date(datetime);

            if (isNaN(parsedDateTime.getTime())) {
                throw new Error('Invalid datetime string: ' + datetime);
            }

            const formattedDateTime = parsedDateTime.toISOString().replace('T', ' ').replace('Z', '').slice(0, -5);

            return formattedDateTime;
        };

        try {
            // Convert datetime-local strings to the required format
            const formattedStartTime = formatDateTime(time_start);
            const formattedEndTime = formatDateTime(time_end);
            console.log('Formatted Start Time:', formattedStartTime);
            console.log('Formatted End Time:', formattedEndTime);

            return query(`
                INSERT INTO events (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link)
                VALUES ($1, $2,TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS') AT TIME ZONE 'Asia/Singapore',
                TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS') AT TIME ZONE 'Asia/Singapore', $5, $6, $7, $8)
                RETURNING *
            `, [title, image_banner, formattedStartTime, formattedEndTime, location, keynote_speaker, description, survey_link])
                .then((result) => {
                    callback(null, result);
                    return result;
                })
                .catch((err) => {
                    console.error(err);
                    callback(err, null);
                    throw err;
                });
        } catch (error) {
            console.error(error.message);
            callback(error, null);
            return Promise.reject(error.message);
        }
    },




    getEvents: function (callback) {
        return query(`SELECT eventid, title, image_banner,
                        TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
                        TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
                        location, keynote_speaker, description, survey_link
                            FROM events ORDER BY eventid ASC;`)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                console.error(err);
                callback(err, null);
            });
    },
    //this function gets everything but time format in UTC
    getEventbyId: function (eventid, callback) {
        return query(`SELECT eventid, title, image_banner,
       TO_CHAR(time_start , 'YYYY-MM-DD HH24:MI:SS' ) AS "time_start",
       TO_CHAR(time_end , 'YYYY-MM-DD HH24:MI:SS' ) AS "time_end",
       location, keynote_speaker, description, survey_link
       FROM events WHERE eventid = $1`, [eventid])

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
    // this function status 200 but gets nothing in postman
    //    getEventbyId: function (eventid, callback) {
    //     const formatDateTime = (datetime) => {
    //         if (datetime === undefined || datetime === null) {
    //             return null;
    //         }

    //         const parsedDateTime = new Date(datetime);

    //         if (isNaN(parsedDateTime.getTime())) {
    //             throw new Error('Invalid datetime string: ' + datetime);
    //         }

    //         // Format the datetime to a string in the desired format
    //         const formattedDateTime = parsedDateTime.toISOString().replace('T', ' ').replace('Z', '').slice(0, -5);

    //         return formattedDateTime;
    //     };

    //     const queryText = 'SELECT *, time_start AT TIME ZONE \'Asia/Singapore\' AS time_start, time_end AT TIME ZONE \'Asia/Singapore\' AS time_end FROM events WHERE eventid = $1';

    //     query(queryText, [eventid])
    //         .then((result) => {
    //             // Format the datetime values in the result
    //             const formattedResult = result.rows.map(row => ({
    //                 ...row,
    //                 formatted_time_start: formatDateTime(row.time_start),
    //                 formatted_time_end: formatDateTime(row.time_end)
    //             }));

    //             console.log(formattedResult);
    //             callback(null, formattedResult);
    //         })
    //         .catch((error) => {
    //             console.error('Error executing query:', error);
    //             callback(error, null); // Pass the error to the callback
    //         });
    // },


    updateEvent: function (eventid, title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link, callback) {
        if (typeof callback !== 'function') {
            console.error('Callback is not a function.');
            return Promise.reject('Callback is not a function.');
        }

        // Function to format datetime strings
        const formatDateTime = (datetime) => {
            if (datetime === undefined || datetime === null) {
                throw new Error('Datetime string is undefined or null.');
            }

            const parsedDateTime = new Date(datetime);

            if (isNaN(parsedDateTime.getTime())) {
                throw new Error('Invalid datetime string: ' + datetime);
            }

            const formattedDateTime = parsedDateTime.toISOString().replace('T', ' ').replace('Z', '').slice(0, -5);

            return formattedDateTime;
        };

        try {
            const formattedStartTime = formatDateTime(time_start);
            const formattedEndTime = formatDateTime(time_end);

            return query(
                'UPDATE events SET title = $2, image_banner = $3, time_start = TO_TIMESTAMP($4, \'YYYY-MM-DD HH24:MI:SS\') AT TIME ZONE \'Asia/Singapore\', time_end = TO_TIMESTAMP($5, \'YYYY-MM-DD HH24:MI:SS\') AT TIME ZONE \'Asia/Singapore\', location = $6, keynote_speaker = $7, description = $8, survey_link = $9 WHERE eventid = $1 RETURNING *',
                [eventid, title, image_banner, formattedStartTime, formattedEndTime, location, keynote_speaker, description, survey_link]
            )



                .then((result) => {
                    // Successfully updated, pass result to callback
                    callback(null, result);
                })
                .catch((error) => {
                    // Handle errors and pass to callback
                    console.error('Error updating event information:', error);
                    callback(error, null);
                });
        } catch (error) {
            // Catch and handle any errors in the try block
            console.error('Error updating event information:', error.message);
            callback(error, null);
        }
    },



    deleteEvent: function (eventid, callback) {
        return query(`DELETE FROM events
        WHERE eventid=$1`,
            [eventid])
            .then((result, err) => {

                if (err) {
                    callback(err, null);
                    return;
                }
                else {
                    return callback(null, result);
                }

            });
    },


            savevents: function (uid, eventid, callback) {
                return query(`INSERT INTO savedevent (uid, eventid) VALUES ($1, $2) RETURNING*`, [uid, eventid]).then((result,err) =>{
        
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
            getusersave: function( uid, callback) {
                return query(`SELECT e.eventid, e.title, e.image_banner,
                TO_CHAR(e.time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
                TO_CHAR(e.time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
                e.location, e.keynote_speaker, e.description, e.survey_link
            FROM events e
            JOIN savedevent s ON e.eventid = s.eventid
            WHERE s.uid = $1; `, [uid]).then((result,err) =>{
            
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    else  {
                        return callback(null, result);
                    } 
                    
                });
            },
            deletesaveEvent: function (eventid, uid, callback) {
                return query(`DELETE FROM savedevent
                WHERE eventid = $1 AND uid = $2;`,
                    [eventid, uid])
                    .then((result, err) => {
        
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        else {
                            return callback(null, result);
                        }
        
                    });
            },
            
        
            
}

module.exports = events;


