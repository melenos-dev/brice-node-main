/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("users", function (table) {
        table.increments("id").primary();
        table.string("firstname", 100).notNullable();
        table.string("lastname", 100).notNullable();
        table.string("email", 255).unique().notNullable();
        table.string("phone", 10);
        table.string("password", 60).notNullable();
        table.json("refresh");
        table.json("roles").notNullable();
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
  return knex.schema.dropTable("users");
}
