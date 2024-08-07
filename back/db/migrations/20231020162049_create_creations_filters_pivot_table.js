/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .hasTable("creations_filters_pivot")
    .then(function (exists) {
      if (!exists) {
        return knex.schema.createTable(
          "creations_filters_pivot",
          function (table) {
            table
              .integer("filter_id", 10)
              .unsigned()
              .notNullable()
              .references("id")
              .inTable("creations_filters");
            table
              .integer("creation_id", 10)
              .unsigned()
              .notNullable()
              .references("id")
              .inTable("creations");
          }
        );
      }
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("creations_filters_pivot");
}
