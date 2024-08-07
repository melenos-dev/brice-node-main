/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable("creations_images_pivot").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable(
        "creations_images_pivot",
        function (table) {
          table
            .integer("image_id", 10)
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("creations_images");
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
  return knex.schema.dropTable("creations_images_pivot");
}
