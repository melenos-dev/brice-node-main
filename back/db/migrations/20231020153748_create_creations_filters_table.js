/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable("creations_filters").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("creations_filters", function (table) {
        table.increments("id").primary();
        table.string("name", 100).unique().notNullable();
        table.timestamps();
      });
    }
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("creations_filters");
}
