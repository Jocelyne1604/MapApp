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
  },
  getPlaces: function (mapId, callback) {
    return knex('places').where('map_id', mapId).then(data => {
      return callback(data);
    });
  },
  getMaps: function (callback) {
    return knex('maps').then(data => {
      return callback(data);
    })
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
