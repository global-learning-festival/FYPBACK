require('dotenv').config();
const res = require('express/lib/response');
const { query } = require("../database")


const product = {
   
   
    addproduct: function(name, description, brand, price, callback) {
        return query(`INSERT INTO producttable ( name, description, brand, price) VALUES ($1, $2, $3, $4) RETURNING*`, [name,  description, brand, price,]).then((result,err) =>{
    
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

    getproduct: function( callback) {
        return pool(`SELECT productid, name, image, description, brand, price FROM producttable`).then((result,err) =>{
    
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







       
                
module.exports = product