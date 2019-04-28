"use strict";

const express = require("express");
const router = express.Router();
const ENV = "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

module.exports = {

  getOneByEmail: function (email) {
    return knex('users')
      .where('email', email)
      .first();
  },

  create: function (user) {
    return knex('users')
      .insert(user, 'id')
      .then(ids => {
        return ids[0];
      });
  },

  getPlaces: function (callback) {
    return knex('places')
      // .where('map_id', mapId)
      .then(data => {
        return callback(data);
      });
  },

  getMaps: function (callback) {
    return knex('maps')
      .then(data => {
        return callback(data);
      });
  },

  getUsersMaps: function (userId, callback) {
    return knex('users_maps')
      .where('user_id', userId)
      .then(data => {
        return callback(data);
      });
  },

  createMaps: function (uId, name, zoom, lat, lng) {
    return knex('maps')
      .insert({
        name: name,
        user_id: uId,
        zoom: zoom,
        lat: lat,
        lng: lng
      }).then(() => {
        console.log("great Success")
      }).catch((err) => {
        console.log("great Failure");
        console.log(err);
      });
  },

  createPlaces: function (userId, description, mapId, lat, lng) {
    let date = new Date()
    return knex('places').insert({
      user_id: userId,
      description: description,
      map_id: mapId,
      created_at: date,
      updated_at: date,
      lat: lat,
      lng: lng
    }).then(() => {
      console.log("great Success")
    }).catch((err) => {
      console.log("great Failure");
      console.log(err);
    });
  }
};

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
