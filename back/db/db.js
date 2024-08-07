import { Model } from "objection";
import Knex from "knex";
import knexfile from "./knexfile.js";

const env = process.env.NODE_ENV || "development";
const configOptions = knexfile[env];

const knex = Knex({
  ...configOptions,
});

export default Model.knex(knex);
