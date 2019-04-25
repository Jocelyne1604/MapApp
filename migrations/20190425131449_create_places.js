exports.up = function (knex, Promise) {
  return knex.schema.createTable('places', function (table) {
    table.increments();
    table.string('description');
    table.string('cam_url');
    table.integer('user_id').unsigned();
    table.integer('map_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.float('lat')
    table.float('lng')

    table.foreign('user_id').references('id').inTable('users');
    table.foreign('map_id').references('id').inTable('maps');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('places');
};
