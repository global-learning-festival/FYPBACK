require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const importantInformation = {
   
    addImportantInfomation: function (title, subtitle, description, image, callback) {
        return query(`INSERT INTO importantinfo (title, subtitle, description, image) VALUES ($1, $2, $3,$4) RETURNING*`, [title, subtitle, description, image]).then((result,err) =>{
    
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
        return query(`SELECT infoid, title, subtitle, description, image FROM importantinfo`).then((result,err) =>{
    
            if (err) {
                callback(err, null);
                return;
            }
            else  {
                return callback(null, result);
            } 
            
        });
    },
    getImportantInformationById: function (infoid, callback) {
        return query('SELECT * FROM importantinfo WHERE infoid = $1', [infoid])
            .then((result, err) => {
                if (err) {
                    callback(err, null);
                    console.log(err);
                    return;
                } else {
                    callback(null, result);
                }
            });
    },
    
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
            console.error('Error updating important information:', error);
            return callback(error, null);
          });
      },
      
      deleteImportantInformation: function (infoid, callback) {
        return query(`DELETE FROM importantinfo
        WHERE infoid=$1`,
        [infoid])
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
           
module.exports = importantInformation;