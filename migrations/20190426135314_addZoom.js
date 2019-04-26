
exports.up = function(knex, Promise) {
    return knex.schema.table('maps', function (table) {
        table.integer('zoom');
        table.float('lat');
        table.float('lng');
      })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('maps', function (table) {
        table.dropColumn('zoom');
        table.dropColumn('lat');
        table.dropColumn('lng');
      })
};
