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

}

module.exports = User;

