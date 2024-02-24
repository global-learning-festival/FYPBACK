require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const importantInformation = {
   //Adds an entry for important information
   addhelpinfo: function (title, subtitle, description, image, callback) {
    return query(`INSERT INTO help (title, subtitle, description, image) VALUES ($1, $2, $3, $4) RETURNING*`, [title, subtitle, description, image])
         .then((result) => {
             callback(null, result);
         })
         .catch((err) => {
             callback(err, null);
             console.log(err);
         });
 },
   
    
    //Gets all important information
    gethelpinfo: function (callback) {
      return  query(`SELECT helpid, title, subtitle, description, image FROM help`)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err, null);
            });
    },
    //Gets one important information by its id
    gethelpid: function (helpid, callback) {
       return query('SELECT * FROM help WHERE helpid = $1', [helpid])
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err, null);
                console.log(err);
            });
    },
    
    //Updates the entry of an important information by id
    updatehelpinfo: function (helpid, title, subtitle, description, image, callback) {
        return query(
          'UPDATE help SET title = $2, subtitle = $3, description = $4, image = $5 WHERE helpid = $1 RETURNING *',
          [helpid, title, subtitle, description, image]
        )
          .then((result, err) => {
            if (err) {
              callback(err, null);
              console.log(err);
              return;
            } else {
              return callback(null, result);
            }
          })
          .catch((error) => {
            //console.error('Error updating important information:', error);
            return callback(error, null);
          });
      },
      //Removes important infromation from the db
      deletehelp: function (helpid, callback) {
        return query(`DELETE FROM help WHERE helpid=$1`, [helpid])
            .then((result) => {
                callback(null, result);
                return result;  // You can also return the result if needed
            })
            .catch((err) => {
                callback(err, null);
                return err;  
            });
    },
    
    
}
           
module.exports = importantInformation;