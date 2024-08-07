import { Model } from "objection";
import unique from "objection-unique";
import Creation from "./creation.js";

const uniqueParams = unique({
  fields: ["name"],
  identifiers: ["id"],
});

class CreationFilter extends uniqueParams(Model) {
  static get tableName() {
    return "creations_filters";
  }

  static get relationMappings() {
    return {
      creations: {
        relation: Model.ManyToManyRelation,
        modelClass: Creation,
        join: {
          from: "creations_filters.id",
          through: {
            from: "creations_filters_pivot.filter_id",
            to: "creations_filters_pivot.creation_id",

            // If you have a model class for the join table
            // you can specify it like this:
            //
            // modelClass: PersonMovie,

            // Columns listed here are automatically joined
            // to the related models on read and written to
            // the join table instead of the related table
            // on insert/update.
            //
            // extra: ['someExtra']
          },
          to: "creations.id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", maxLength: 10, minLength: 2 },
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

  /*
  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    let location = json.location;
    if (location) {
      location = JSON.parse(location);
    }
    return Object.assign({}, json, { location });
  }
  */
}

export default CreationFilter;
