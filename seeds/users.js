exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_maps').del()
    .then(() => knex('places').del())
    .then(() => knex('maps').del())
    .then(() => knex('users').del())
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([ //users
        {
          id: 1,
          name: 'Jeff',
          email: 'jeff@canada.ca',
          password: 'hungry'
        },
        {
          id: 2,
          name: 'Jaffar',
          email: 'shah@northamerica.com',
          password: 'jaffar'
        },
      ]).then(function () {
        return knex('maps').insert([ //maps
          {
            id: 1,
            user_id: 1,
            name: 'Jeff',
            zoom: 1,
            lat: 42.5,
            lng: 79.5,
          },
        ]);
      }).then(function () {
        return knex('places').insert([ //places
          {
            description: 'niceplace',
            map_id: 1,
            user_id: 1,
            lat: 0.5,
            lng: 0.8,

          },
          {
            description: 'otherplace',
            map_id: 1,
            user_id: 1,
            lat: 1.5,
            lng: 10.8,

          },
        ]);
      }).then(function () {
        return knex('users_maps').insert([ //places
          {
            id: 1,
            user_id: 1,
            map_id: 1,
          },
        ]);
      })
    })
};
