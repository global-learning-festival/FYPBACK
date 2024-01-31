require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const User = {
  addadmin: function (username, password, type, callback) {
    return query(
      `INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`,
      [username, password, type]
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

  getAdmin: function (callback) {
    return query(`SELECT username, type FROM role;`).then((result, err) => {
      if (err) {
        console.error("Error fetching users:", err);
        callback(err, null);
        return;
      } else {
        console.log("Users fetched successfully:", result);
        return callback(null, result);
      }
    });
  },
  getUserByType: function (type, callback) {
    return query(
      `SELECT roleid, username, password, type FROM announcements WHERE type = $1;`,
      [type]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },
  updateUser: function (username, password, type, roleid, callback) {
    return query(
      `UPDATE role SET username = $1, password = $2, type = $3 WHERE roleid = $4 RETURNING *`,
      [username, password, type, roleid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        console.log(err);
      } else {
        callback(null, result);
      }
    });
  },
  deleteUser: function (roleid, callback) {
    return query(`DELETE FROM role WHERE roleid = $1;`, [roleid]).then(
      (result, err) => {
        if (err) {
          callback(err, null);
          return;
        } else {
          return callback(null, result);
        }
      }
    );
  },
  addUser: function (first_name, last_name, company, uid, type, callback) {
    return query(
      `INSERT INTO users (first_name, last_name, company, uid,type) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
      [first_name, last_name, company, uid, type]
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

  getUserByUid: function (uid, callback) {
    return query(`SELECT * FROM users WHERE uid = $1`, [uid])
      .then((result) => {
        // Return the user if found, otherwise return null
        return callback(null, result.rows.length > 0 ? result.rows[0] : null);
      })
      .catch((err) => {
        console.error("Error retrieving user by UID:", err);
        callback(err, null);
      });
  },
  // for admin list
  getUsers: function (callback) {
    return query(`SELECT first_name , last_name , type  FROM users`).then(
      (result, err) => {
        if (err) {
          callback(err, null);
          return;
        } else {
          return callback(null, result);
        }
      }
    );
  },
  //for user side
  getUserList: function (callback) {
    return query(
      `SELECT first_name , last_name , company ,linkedinurl, jobtitle , profile_pic FROM users`
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  getUserById: function (userid, callback) {
    return query(
      `SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle FROM users WHERE userid = $1`,
      [userid]
    )
      .then((result) => {
        // Return the user if found, otherwise return null
        return callback(null, result.rows.length > 0 ? result.rows[0] : null);
      })
      .catch((err) => {
        console.error("Error retrieving user by ID:", err);
        callback(err, null);
      });
  },
  updateUsers: function (
    userid,
    company,
    jobtitle,
    linkedinurl,
    profile_pic,
    callback
  ) {
    query(
      `UPDATE users SET company = $2, jobtitle = $3, linkedinurl = $4, profile_pic = $5 WHERE userid = $1 RETURNING *`,
      [userid, company, jobtitle, linkedinurl, profile_pic]
    )
      .then((result) => {
        // Handle the result here
        callback(null, result);
      })
      .catch((err) => {
        // Handle the error here
        console.error(err);
        callback(err, null);
      });
  },

  addManager: function (username, password, type, callback) {
    return query(
      `INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`,
      [username, password, type]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        console.log(err);
        return;
      } else {
        return callback(result, null);
      }
    });
  },
};

module.exports = User;
