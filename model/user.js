require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const User = {

    addUser: function (username, password, type, callback) {
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

    getUsers: function(callback) {
        return query(`SELECT roleid, username, password, type FROM role ORDER BY updated_at DESC;`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
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

}

module.exports = User;
