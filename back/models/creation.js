import { Model } from "objection";
import User from "./user.js";
import CreationFilter from "./creation_filter.js";
import CreationImage from "./creation_image.js";

class Creation extends Model {
  static get tableName() {
    return "creations";
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "creations.user_id",
          to: "users.id",
        },
      },

      filters: {
        relation: Model.ManyToManyRelation,
        modelClass: CreationFilter,
        join: {
          from: "creations.id",
          through: {
            from: "creations_filters_pivot.creation_id",
            to: "creations_filters_pivot.filter_id",

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
          to: "creations_filters.id",
        },
      },

      images: {
        relation: Model.ManyToManyRelation,
        modelClass: CreationImage,
        join: {
          from: "creations.id",
          through: {
            from: "creations_images_pivot.creation_id",
            to: "creations_images_pivot.image_id",

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
          to: "creations_images.id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "user_id"],

      properties: {
        id: { type: "integer" },
        title: { type: "string", maxLength: 50 },
        desc: { type: "string" },
        pos: { type: "number" },
        user_id: { type: "integer" },
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

export default Creation;
