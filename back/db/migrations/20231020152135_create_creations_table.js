/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable("creations").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("creations", function (table) {
        table.increments("id").primary();
        table.string("title", 50).notNullable();
        table.text("desc");
        table.decimal("pos", 8, 0);
        table
          .integer("user_id", 10)
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users");
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
  return knex.schema.dropTable("creations");
}
