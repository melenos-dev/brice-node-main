/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("quiz").del();
  await knex("quiz").insert([
    { id: 1, name: "Quiz pour site existant" },
    { id: 2, name: "Quiz pour nouveau site" },
  ]);
};
