"use strict";

const express = require('express');
const router = express.Router();
const ENV = "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

module.exports = {

  getOneByEmail: function (email) {
    return knex('users').where('email', email).first();
  },
  create: function (user) {
    return knex('users').insert(user, 'id').then(ids => {
      return ids[0];
    });
  }
}





//   router.get("/", (req, res) => {
//     knex
//       .select("*")
//       .from("users")
//       .then((results) => {
//         res.json(results);
//         console.log(results);
//       });
//   });

// return router;
// }

// module.exports = {
