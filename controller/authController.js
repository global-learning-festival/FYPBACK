const user = require('../model/user');
const auth = require('../model/login');
const bcrypt = require('bcrypt');
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.processLogin = (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;
    try {
        auth.verify(username, function(error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                return res.status(500).json({ message: message });

            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(500).json({ message: 'Login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].password) == true) {

                        let data = {
                            user_id: results[0].roleid,
                            role_name: results[0].type,
                            token: jwt.sign({ id: results[0].roleid,role:results[0].type}, config.process.env.JWTKEY, {
                                expiresIn: 36000 //Expires in 10h
                            })
                        }; //End of data variable setup

                        return res.status(200).json(data);
                    } else {
                        return res.status(500).json({ message: 'Login has failed.' });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: message });
    } //end of try



};

exports.processRegister = (req, res, next) => {
    console.log('processRegister running.');
    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;

    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            return res.status(500).json({ statusMessage: 'Unable to complete registration' });
        } else {
            
                results = user.addManager(username, hash, type, function(results, error){
                  if (results!=null){
                    console.log(results);
                    return res.status(200).json({ statusMessage: 'Completed registration.' });
                  }
                  if (error) {
                    console.log('processRegister method : callback error block section is running.');
                    console.log(error, '==================================================================');
                    return res.status(500).json({ statusMessage: 'Unable to complete registration' });
                }
                });//End of anonymous callback function
     
          
        }
    });


}; // End of processRegister