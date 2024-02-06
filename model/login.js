require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const login = {
  //Gets details of user attempting to login
  verify: function (username, callback) {
    return query(`select * from role where username = $1`, [username]).then(
      (result, err) => {
        if (err) {
          callback(err, null);
          return;
        } else if (result.length === 0) {
          return callback(null, null);
        } else {
          // to see the result
          console.log("result:", result);

          const user = result.rows[0];
          console.log("resultlength", user);

          return callback(null, user);
        }
      }
    );
  },
};

module.exports = login;
