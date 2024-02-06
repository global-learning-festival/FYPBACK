require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const announcement = {
  addAnnouncement: function (title, description, image, eventid, callback) {
    return query(
      `INSERT INTO announcements ( title , description, image, eventid) VALUES ($1, $2, $3, $4) RETURNING*`,
      [title, description, image, eventid]
    ).then(result=> {
        return callback(null, result);
      
    }).catch(error=>{
      return callback(error, null);

    });
  },

  getAnnouncements: function (callback) {
    return query(
      `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  getAnnouncementById: function (announcementid, callback) {
    return query(
      `SELECT announcementid,eventid, title, description, image, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE announcementid = $1;`,
      [announcementid]
      ).then(result=> {
          return callback(null, result);
        
      }).catch(error=>{
        return callback(error, null);

      });
  },
  updateAnnouncement: function (
    announcementid,
    title,
    description,
    image,
    eventid,
    callback
  ) {
    return query(
      `UPDATE announcements SET title = $1, description = $2, image = $3,eventid = $4 WHERE announcementid = $5 RETURNING *`,
      [title, description, image, eventid, announcementid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  deleteAnnouncement: function (announcementid, callback) {
    return query(`DELETE FROM announcements WHERE announcementid = $1;`, [
      announcementid,
    ]).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets a list of events for admin to select to link to an announcement
  getEventList: function (callback) {
    return query(`SELECT eventid, title FROM events`)
    .then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets the announcements for a specific event
  getAnnouncementsByEventId: function (eventid, callback) {
    return query(
      `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE eventid = $1 ORDER BY updated_at DESC;`,
      [eventid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
};

module.exports = announcement;
