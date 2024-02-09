require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const User = {
  //Gets all admin/event manager users
  getAdmin: function (callback) {
    return query(`SELECT username, type FROM role;`)
    .then(result=> {
      //console.log("Users fetched successfully:", result);
      return callback(null, result);
    
  }).catch(error=>{
    //console.error("Error fetching users:", err);
    return callback(error, null);

  });
  },
  //Gets all users sorted per role type
  getUserByType: function (type, callback) {
    return query(
      `SELECT roleid, username, password, type FROM announcements WHERE type = $1;`,
      [type]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Updates user information
  // updateUser: function (username, password, type, roleid, callback) {
  //   return query(
  //     `UPDATE role SET username = $1, password = $2, type = $3 WHERE roleid = $4 RETURNING *`,
  //     [username, password, type, roleid]
  //   ).then((result, err) => {
  //     if (err) {
  //       callback(err, null);
  //       console.log(err);
  //     } else {
  //       callback(null, result);
  //     }
  //   });
  // },
  //Removes user from db
  deleteUser: function (roleid, callback) {
    return query(`DELETE FROM role WHERE roleid = $1;`, [roleid])
    .then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Adds new user into db
  addUser: function (first_name, last_name, company, uid, type, callback) {
    return query(
      `INSERT INTO users (first_name, last_name, company, uid, type) VALUES ($1, $2, $3, $4, $5) RETURNING*`,
      [first_name, last_name, company, uid, type]
    ).then(result=> {
       callback(null, result);
    
  }).catch(error=>{
    callback(error, null);

  });
  },
  //Adds a user connecting with Linkedin
  addLinkedinUser: function (
    first_name,
    last_name,
    company,
    linkedinurl,
    uid,
    type,
    callback
  ) {
    return query(
      `INSERT INTO users (first_name, last_name, company, linkedinurl, uid, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*`,
      [first_name, last_name, company, linkedinurl, uid, type]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets all users from admin and regular users for admin frontend
  getUsers: function (callback) {
    return query(`SELECT first_name , last_name , type  FROM users`)
    .then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets all users at event on the user facing frontend
  getUserList: function (callback) {
    return query(
      `SELECT first_name , last_name , company ,linkedinurl, jobtitle , profile_pic FROM users`
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  //Gets one specific user by userid
  getUserById: function (userid, callback) {
    return query(
      `SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE userid = $1`,
      [userid]
    )
      .then((result) => {
        // Return the user if found, otherwise return null
        return callback(null, result.rows.length > 0 ? result.rows[0] : null);
      })
      .catch((err) => {
        //console.error("Error retrieving user by ID:", err);
        callback(err, null);
      });
  },
  //Gets one specific user by linkedinn userid
  getUserByUid: function (uid, callback) {
    return query(
      `SELECT userid, uid, first_name, last_name, company, linkedinurl, jobtitle , profile_pic FROM users WHERE uid = $1`,
      [uid] // Convert uid to string explicitly
    )
      .then((result) => {
        // Return the user if found, otherwise return null
        return callback(null, result);
      })
      .catch((err) => {
       // console.error("Error retrieving user by UID:", err);
        callback(err, null);
      });
  },
  //Updates a user by userid
  updateUsers: function (
    uid,
    company,
    jobtitle,
    linkedinurl,
    profile_pic,
    callback
  ) {
    return query(
      `UPDATE users SET company = $2, jobtitle = $3, linkedinurl = $4, profile_pic = $5 WHERE uid = $1 RETURNING *`,
      [uid, company, jobtitle, linkedinurl, profile_pic]
    )
      .then((result) => {
        // Handle the result here
        return callback(null, result);
      })
      .catch((err) => {
        // Handle the error here
        return callback(err, null);
      });
  },
  //Part of registration of admin/event managers
  addManager: function (username, password, type, callback) {
    return query(
      `INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`,
      [username, password, type]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
  deleteManager: function (roleid, callback) {
    return query(
      `DELETE FROM role WHERE roleid=$1`,
      [roleid]
    ).then(result=> {
      return callback(null, result);
    
  }).catch(error=>{
    return callback(error, null);

  });
  },
};

module.exports = User;
