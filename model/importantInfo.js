require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const importantInformation = {
   
    addImportantInfomation: function (title, subtitle, description, callback) {
        return query(`INSERT INTO importantinfo (title, subtitle, description) VALUES ($1, $2, $3) RETURNING*`, [title, subtitle, description]).then((result,err) =>{
    
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

    getImportantInfomation: function (callback) {
        return query(`SELECT title, subtitle, description FROM importantinfo`).then((result,err) =>{
    
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
           
module.exports = importantInformation;