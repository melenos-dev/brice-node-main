import { Model } from "objection";
import Creations from "./creation.js";
import unique from "objection-unique";

const uniqueParams = unique({
  fields: ["email", "phone"],
  identifiers: ["id"],
});

class User extends uniqueParams(Model) {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      replies: {
        relation: Model.HasManyRelation,
        modelClass: Creations,
        join: {
          from: "users.id",
          to: "creations.user_id",
        },
      },
    };
  }

  fullName() {
    return this.firstname + " " + this.lastname;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstname", "lastname", "email", "password", "roles"],

      properties: {
        id: { type: "integer" },
        firstname: { type: "string", maxLength: 100 },
        lastname: { type: "string", maxLength: 100 },
        email: { type: "string", format: "email", maxLength: 255 },
        phone: { type: "number" },
        password: { type: "string", maxLength: 60 },
        refresh: { type: "object", default: { tokens: [] } },
        roles: { type: "object" },
        created_at: {
          type: "string",
          format: "date-time",
          default: new Date().toISOString(),
        },
        updated_at: {
          type: "string",
          format: "date-time",
          default: new Date().toISOString(),
        },

        // Properties defined as objects or arrays are
        // automatically converted to JSON strings when
        // writing to database and back to objects and arrays
        // when reading from database. To override this
        // behaviour, you can override the
        // Model.jsonAttributes property.
      },
    };
  }
}

export default User;
