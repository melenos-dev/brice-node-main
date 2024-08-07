import CreationFilter from "../models/creation_filter.js";
import Creation from "../models/creation.js";

function security(obj) {
  if (obj.name.length > 10 || obj.name.length < 3) return true;
}

// Save a new filter
export function create(req, res, next) {
  const filterObject = req.body;
  let err = security(filterObject);
  if (err)
    return res.status(422).json({
      message: err,
    });

  CreationFilter.query()
    .insert(filterObject)
    .then((filter) => res.status(201).json(filter))
    .catch((error) => res.status(409).json({ error }));
}

// Create join table for creation filters
export function relate(req, res, next) {
  const joinObject = req.body;
  console.log(joinObject);
  Creation.query()
    .findById(joinObject.creation_id)
    .then((creation) => {
      joinObject.filters_id.map(async (current) => {
        const relate = await creation
          .$relatedQuery("filters")
          .relate(current.id);
      });
      return res.status(200).json({ message: "Filters related successfuly !" });
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
}

// Get all filters
export function getAll(req, res, next) {
  CreationFilter.query()
    .then((filters) => {
      return res.status(200).json(filters);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
}

export function getByCreation(req, res, next) {
  const creationId = req.params.id;
  CreationFilter.query()
    .withGraphJoined("creation")
    .then((filters) => {
      console.log(filters);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        error: error,
      });
    });
}

// Get one filter by params.id
export function getById(req, res, next) {
  CreationFilter.query()
    .findOne({ id: req.params.id })
    .then((filter) => res.status(200).json(filter))
    .catch((error) => res.status(404).json({ error }));
}

// Edit one filter by params.id
export function edit(req, res, next) {
  const filterObject = req.body;

  CreationFilter.query()
    .findOne({ id: req.params.id })
    .then((filter) => {
      // If the user isn't admin or superAdmin
      if (!req.auth.roles.levels.includes(50, 99)) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        let err = security(filterObject);
        if (err)
          return res.status(422).json({
            message: "Security problem with the value of your inputs",
          });

        filter
          .$query()
          .update({ filterObject })
          .then(() => res.status(200).json({ message: "Filter edited !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

// Delete filter by params.id
export function del(req, res, next) {
  CreationFilter.query()
    .findById(req.params.id)
    .then(async (filter) => {
      const unrelateCreations = await filter
        .$relatedQuery("creations")
        .unrelate()
        .catch((error) => {
          return res.status(400).json({ error });
        });

      filter
        .$query()
        .delete()
        .then(() => res.status(200).json(filter))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}
