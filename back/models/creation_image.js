import { Model } from "objection";
import unique from "objection-unique";

const uniqueParams = unique({
  fields: ["name"],
  identifiers: ["id"],
});

class CreationImage extends uniqueParams(Model) {
  static get tableName() {
    return "creations_images";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", maxLength: 100, minLength: 2 },
        cover: { type: "boolean" },
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

export default CreationImage;
