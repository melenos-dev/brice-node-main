/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable("creations_images").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("creations_images", function (table) {
        table.increments("id").primary();
        table.string("name", 100).unique().notNullable();
        table.boolean("cover").defaultTo(false);
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
  return knex.schema.dropTable("creations_images");
}
