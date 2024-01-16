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
            // Check if datetime is undefined or null
            if (datetime === undefined || datetime === null) {
                throw new Error('Datetime string is undefined or null.');
            }

            // Parse the input datetime string
            const parsedDateTime = new Date(datetime);

            // Check if the parsedDateTime is a valid date
            if (isNaN(parsedDateTime.getTime())) {
                throw new Error('Invalid datetime string: ' + datetime);
            }

            // Format the date-time string in 'YYYY-MM-DD HH24:MI:SS' format
            const formattedDateTime = parsedDateTime.toISOString().replace('T', ' ').replace('Z', '').slice(0, -5);

            return formattedDateTime;
        };

        try {
            // Convert datetime-local strings to the required format
            const formattedStartTime = formatDateTime(time_start);
            const formattedEndTime = formatDateTime(time_end);

            return query(`
                INSERT INTO events (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link)
                VALUES ($1, $2, TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS'), $5, $6, $7, $8)
                RETURNING *
            `, [title, image_banner, formattedStartTime, formattedEndTime, location, keynote_speaker, description, survey_link])
                .then((result) => {
                    callback(null, result);
                    return result;
                })
                .catch((err) => {
                    console.error(err);
                    callback(err, null);
                    throw err; // Rethrow the error for further handling if needed
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
                            FROM events`)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                console.error(err);
                callback(err, null);
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
    updateEvent: function (eventid, title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link, callback) {
        // Ensure non-empty values for time_start and time_end
        const formattedTimeStart = time_start ? new Date(time_start).toUTCString() : null;
        const formattedTimeEnd = time_end ? new Date(time_end).toUTCString() : null;

        return query(
            'UPDATE events SET title = $2, image_banner = $3, time_start = $4, time_end = $5, location = $6, keynote_speaker = $7, description = $8, survey_link = $9 WHERE eventid = $1 RETURNING *',
            [eventid, title, image_banner, formattedTimeStart, formattedTimeEnd, location, keynote_speaker, description, survey_link]
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
    },



    deleteEvent: function (eventid, callback) {
        return query(`DELETE FROM events
        WHERE eventid=$1`,
            [eventid])
            .then((result, err) => {

                return query(`SELECT eventid, title, image_banner, TO_CHAR(time_start, 'DD/MM/YYYY ,HH12:MIam') AS "time_start", TO_CHAR(time_end, 'DD/MM/YYYY ,HH12:MIam') AS "time_end", location, keynote_speaker, description, survey_link FROM events`).then((result, err) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    else {
                        return callback(null, result);
                    }

                });
            },
            )
    },
}

module.exports = events;


