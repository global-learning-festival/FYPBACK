require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const announcement = {
  addAnnouncement: function (title, description, image, eventid, callback) {
    return query(
      `INSERT INTO announcements ( title , description, image, eventid) VALUES ($1, $2, $3, $4) RETURNING*`,
      [title, description, image, eventid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        console.log(err);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  getAnnouncements: function (callback) {
    return query(
      `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements ORDER BY updated_at DESC;`
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },
  getAnnouncementById: function (announcementid, callback) {
    return query(
      `SELECT announcementid,eventid, title, description, image, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE announcementid = $1;`,
      [announcementid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
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
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        console.log(err);
      } else {
        callback(null, result);
      }
    });
  },
  deleteAnnouncement: function (announcementid, callback) {
    return query(`DELETE FROM announcements WHERE announcementid = $1;`, [
      announcementid,
    ]).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },
  getEventList: function (callback) {
    return query(`SELECT eventid, title FROM events`).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  getAnnouncementsByEventId: function (eventid, callback) {
    return query(
      `SELECT announcementid, eventid, title, description, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS "created_on", TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS "updated_on" FROM announcements WHERE eventid = $1 ORDER BY updated_at DESC;`,
      [eventid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },
};

module.exports = announcement;
