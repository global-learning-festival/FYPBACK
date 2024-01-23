require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const User = {

    addadmin: function (username, password, type, callback) {
        return query(`INSERT INTO role (username, password, type) VALUES ($1, $2, $3) RETURNING*`, [username, password, type]).then((result,err) =>{

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

    getAdmin: function(callback) {
        return query(`SELECT username, type FROM role;`).then((result, err) => {
            if (err) {
                console.error('Error fetching users:', err);
                callback(err, null);
                return;
            } else {
                console.log('Users fetched successfully:', result);
                return callback(null, result);
            }
        });
    },
    getUserByType: function(type, callback) {
        return query(`SELECT roleid, username, password, type FROM announcements WHERE type = $1;`, [type]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    updateUser: function(username, password, type, roleid, callback) {
        return query(`UPDATE role SET username = $1, password = $2, type = $3 WHERE roleid = $4 RETURNING *`, [username, password, type, roleid])

            .then((result, err) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                } else {
                    callback(null, result);
                }
            });
    },
       deleteUser: function(roleid, callback) {
        return query(`DELETE FROM role WHERE roleid = $1;`, [roleid]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    addUser: function (first_name, last_name, company, uid, callback) {
        return query(`INSERT INTO users (first_name, last_name, company, uid) VALUES ($1, $2, $3, $4) RETURNING*`, [first_name, last_name, company, uid]).then((result,err) =>{

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

  
getUserByUid: function(uid, callback) {
    return query(`SELECT * FROM users WHERE uid = $1`, [uid])
        .then(result => {
            // Return the user if found, otherwise return null
            return callback(null, result.rows.length > 0 ? result.rows[0] : null);
        })
        .catch(err => {
            console.error('Error retrieving user by UID:', err);
            callback(err, null);
        });
},
getUsers: function(callback) {
    return query(`SELECT first_name , last_name , type  FROM users`)
    .then((result,err) =>{
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

module.exports = User;
