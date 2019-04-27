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
          email: 'jaffarshah@northamerica.com',
          password: 'jaffar'
        },
      ]).then(function () {
        return knex('maps').insert([ //maps
          {
            id: 1,
            user_id: 1,
            name: 'Jaffars Financials',
            zoom: 1,
            lat: 42.5,
            lng: 79.5,
          },
          {
            id: 2,
            user_id: 2,
            name: 'Michaels Industries',
            zoom: 1,
            lat: 44.50,
            lng: 79.1,
          },
          {
            id: 3,
            user_id: 2,
            name: 'Jocelyn Centers',
            zoom: 1,
            lat: 41.2,
            lng: 79.3,
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
