require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../db")


const login = {
   
    verify: function(username, password, callback) {
        return query(`select * from userinfo where username = $1 and password = $2`, [username,password]).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else if (result.length === 0) {
                return callback(null, null);
            } else {
                // to see the result
               console.log("result:",result);

                const user = result.rows[0];
                
                return callback(null, user);
               
            }
            
        });
    }
}





       
                
module.exports = login

  