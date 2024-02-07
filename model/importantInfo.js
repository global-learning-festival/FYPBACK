require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const importantInformation = {
   //Adds an entry for important information
   addImportantInfomation: function (title, subtitle, description, image, callback) {
    return query(`INSERT INTO importantinfo (title, subtitle, description, image) VALUES ($1, $2, $3, $4) RETURNING*`, [title, subtitle, description, image])
         .then((result) => {
             callback(null, result);
         })
         .catch((err) => {
             callback(err, null);
             console.log(err);
         });
 },
   
    
    //Gets all important information
    getImportantInfomation: function (callback) {
      return  query(`SELECT infoid, title, subtitle, description, image FROM importantinfo`)
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err, null);
            });
    },
    //Gets one important information by its id
    getImportantInformationById: function (infoid, callback) {
       return query('SELECT * FROM importantinfo WHERE infoid = $1', [infoid])
            .then((result) => {
                callback(null, result);
            })
            .catch((err) => {
                callback(err, null);
                console.log(err);
            });
    },
    
    //Updates the entry of an important information by id
    updateImportantInformation: function (infoid, title, subtitle, description, image, callback) {
        return query(
          'UPDATE importantinfo SET title = $2, subtitle = $3, description = $4, image = $5 WHERE infoid = $1 RETURNING *',
          [infoid, title, subtitle, description, image]
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
      deleteImportantInformation: function (infoid, callback) {
        return query(`DELETE FROM importantinfo WHERE infoid=$1`, [infoid])
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