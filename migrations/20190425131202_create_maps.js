exports.up = function(knex, Promise) {
    return knex.schema.createTable('maps', function (table) {
        table.increments();
        table.string('name');
        table.integer('user_id').unsigned();
        table.timestamps();
        table.foreign('user_id').references('id').inTable('users');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('maps');
};
