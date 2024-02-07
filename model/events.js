require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const events = {
  //Adds a new event into the db
  addEvent: function (
    title,
    image_banner,
    time_start,
    time_end,
    location,
    keynote_speaker,
    description,
    survey_link,
    callback
  ) {
    if (typeof callback !== "function") {
      //console.error("Callback is not a function.");
      return Promise.reject("Callback is not a function.");
    }

    // Function to format datetime strings
    const formatDateTime = (datetime) => {
      if (datetime === undefined || datetime === null) {
        throw new Error("Datetime string is undefined or null.");
      }

      const parsedDateTime = new Date(datetime);

      if (isNaN(parsedDateTime.getTime())) {
        throw new Error("Invalid datetime string: " + datetime);
      }

      const formattedDateTime = parsedDateTime
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
        .slice(0, -5);

      return formattedDateTime;
    };

    try {
      // Convert datetime-local strings to the required format
      const formattedStartTime = formatDateTime(time_start);
      const formattedEndTime = formatDateTime(time_end);
      console.log("Formatted Start Time:", formattedStartTime);
      console.log("Formatted End Time:", formattedEndTime);

      return query(
        `
                INSERT INTO events (title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link)
                VALUES ($1, $2,TO_TIMESTAMP($3, 'YYYY-MM-DD HH24:MI:SS'),
                TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS') , $5, $6, $7, $8)
                RETURNING *
            `,
        [
          title,
          image_banner,
          formattedStartTime,
          formattedEndTime,
          location,
          keynote_speaker,
          description,
          survey_link,
        ]
      )
        .then((result) => {
          return callback(null, result);
        })
        .catch((err) => {
          //console.error(err);
          return callback(err, null);
        });
    } catch (error) {
      //console.error(error.message);
      callback(error, null);
      return Promise.reject(error.message);
    }
  },
  //Gets all events
  getEvents: function (callback) {
    return query(`SELECT eventid, title, image_banner,
                        TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
                        TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
                        location, keynote_speaker, description, survey_link
                            FROM events ORDER BY time_start ASC;`)
      .then((result) => {
        callback(null, result);
      })
      .catch((err) => {
        //console.error(err);
        callback(err, null);
      });
  },
  //this function gets everything but time format in UTC
  getEventbyId: function (eventid, callback) {
    return query(
      `SELECT eventid, title, image_banner,
       TO_CHAR(time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start",
       TO_CHAR(time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end",
       location, keynote_speaker, description, survey_link
       FROM events WHERE eventid = $1`,[eventid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },

  updateEvent: function (
    eventid,
    title,
    image_banner,
    time_start,
    time_end,
    location,
    keynote_speaker,
    description,
    survey_link,
    callback
  ) {
    if (typeof callback !== "function") {
      //console.error("Callback is not a function.");
      return Promise.reject("Callback is not a function.");
    }

    // Function to format datetime strings
    const formatDateTime = (datetime) => {
      if (datetime === undefined || datetime === null) {
        throw new Error("Datetime string is undefined or null.");
      }

      const parsedDateTime = new Date(datetime);

      if (isNaN(parsedDateTime.getTime())) {
        throw new Error("Invalid datetime string: " + datetime);
      }

      const formattedDateTime = parsedDateTime
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
        .slice(0, -5);

      return formattedDateTime;
    };

    try {
      const formattedStartTime = formatDateTime(time_start);
      const formattedEndTime = formatDateTime(time_end);

      return query(
        "UPDATE events SET title = $2, image_banner = $3, time_start = TO_TIMESTAMP($4, 'YYYY-MM-DD HH24:MI:SS'), time_end = TO_TIMESTAMP($5, 'YYYY-MM-DD HH24:MI:SS') , location = $6, keynote_speaker = $7, description = $8, survey_link = $9 WHERE eventid = $1 RETURNING *",
        [
          eventid,
          title,
          image_banner,
          formattedStartTime,
          formattedEndTime,
          location,
          keynote_speaker,
          description,
          survey_link,
        ]
      )
        .then((result) => {
          // Successfully updated, pass result to callback
          callback(null, result);
        })
        .catch((error) => {
          // Handle errors and pass to callback
          //console.error("Error updating event information:", error);
          callback(error, null);
        });
    } catch (error) {
      // Catch and handle any errors in the try block
      //console.error("Error updating event information:", error.message);
      callback(error, null);
    }
  },
  //Removes event from the db
  deleteEvent: function (eventid, callback) {
    return query(
      `DELETE FROM events WHERE eventid = $1`,
      [eventid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Adds an event to a list of saved events 
  savevents: function (uid, eventid, callback) {
    return query(
      `INSERT INTO savedevent (uid, eventid) VALUES ($1, $2) RETURNING *`,
      [uid, eventid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets a user's own saved events
  getusersave: function (uid, callback) {
    return query(
      `SELECT e.eventid, e.title, e.image_banner, TO_CHAR(e.time_start, 'YYYY-MM-DD HH24:MI:SS') AS "time_start", TO_CHAR(e.time_end, 'YYYY-MM-DD HH24:MI:SS') AS "time_end", e.location, e.keynote_speaker, e.description, e.survey_link FROM events e JOIN savedevent s ON e.eventid = s.eventid WHERE s.uid = $1; `,
      [uid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Removes a saved event from its list
  deletesaveEvent: function (eventid, uid, callback) {
    return query(
      `DELETE FROM savedevent WHERE eventid = $1 AND uid = $2`,
      [eventid, uid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets the event that was saved the most across users
  getmostsavedEvent: function (callback) {
    return query(`SELECT e.eventid, e.title, COUNT(s.savedid) as savedCount FROM events e JOIN savedevent s ON e.eventid = s.eventid GROUP BY e.eventid ORDER BY savedCount DESC LIMIT 1;`)
                .then(result=> {
                  return callback(null, result);
                
              }).catch(error=>{
                return callback(error, null);
            
              });
  },
};

module.exports = events;
