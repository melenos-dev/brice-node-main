import Creation from "../models/creation.js";
import CreationImage from "../models/creation_image.js";
import * as Security from "./security.js";
import fs from "fs";

function security(obj) {
  if (obj.title.length > 50) return "Length of title should be 50 maximum.";
  return false;
}

async function deleteImages(images) {
  images.forEach((image) => {
    let path = `public/assets/creations/${image.name}`;
    let fileExist = fs.existsSync(path);
    if (fileExist)
      fs.unlink(path, (error) => {
        if (error) {
          return res.status(500).json({
            message: error,
          });
        }

        image instanceof CreationImage
          ? image
              .$query()
              .delete()
              .catch((error) => {
                return res.status(500).json({
                  message: error,
                });
              })
          : CreationImage.query()
              .findOne({ name: image.name })
              .delete()
              .catch((error) => {
                return res.status(500).json({
                  message: error,
                });
              });
      });
  });
}

async function clear(creation) {
  creation.images instanceof CreationImage
    ? creation
        .$relatedQuery("images")
        .unrelate()
        .then(async () => {
          console.log(creation.images);
          await deleteImages(creation.images);
          creation
            .$query()
            .delete()
            .then(() => {
              return res.status(200).json({ message: "Creation deleted !" });
            })
            .catch((error) => {
              return res.status(400).json({ error });
            });
        })
    : deleteImages(creation.images);
}

// Save a new creation
export function create(req, res, next) {
  const creationObject = req.body;

  let err = security(creationObject);
  if (err)
    return res.status(422).json({
      message: err,
    });

  Creation.query() // get next pos value
    .max("pos as max")
    .first()
    .then((pos) => {
      let nextPos = pos.max === null ? 1 : Number(pos.max + 1);
      const files = req.files;
      let images = [];

      if (files.length > 0) {
        let i = 0;
        files.forEach((file) => {
          let cover = i === 0 ? true : false;

          images.push({
            name: file.filename,
            cover: cover,
          });

          i++;
        });
      } else
        return res
          .status(400)
          .json("Problem while writing images into server.");

      const creation = {
        ...creationObject,
        pos: nextPos,
        user_id: req.id, // Recover the user id with the JWT middleware
        images: images,
      };

      Creation.query()
        .insertGraph(creation)
        .then((creation) => {
          res.status(201).json({ id: creation.id });
        })
        .catch(async (error) => {
          await clear(creation);
          return res.status(400).json(error.message);
        });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
}

// Record images to join table
export function relateImages(req, res, next) {
  const joinObject = req.body;
  Creation.query()
    .findById(joinObject.creation_id)
    .then((creation) => {
      joinObject.images_id.map(async (current) => {
        const relate = await creation
          .$relatedQuery("images")
          .relate(current.id);
      });
      return res.status(200).json({ message: "Images related successfuly !" });
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
}

// Get all creation
export function getAll(req, res, next) {
  Creation.query()
    .withGraphJoined("images")
    .then((creations) => {
      creations.forEach((creation) => {
        console.log(creation);
        // Add image path to creations object
        creation.images.forEach((image) => {
          let path = `assets/creations/${image.name}`;
          image.cover === 1
            ? (creation.coverUrl = `${req.protocol}://${req.get(
                "host"
              )}/${path}`)
            : "";
        });
      });
      return res.status(200).json(creations);
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
      });
    });
}

export function getTotalLength(req, res, next) {
  Creation.query()
    .select("id")
    .then((creations) => {
      return res.status(200).json(creations?.length ? creations.length : 0);
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
      });
    });
}

// Get one creation by params.id
export function getById(req, res, next) {
  Creation.query()
    .findOne({ id: req.params.id })
    .then((creation) => res.status(200).json(creation))
    .catch((error) => res.status(404).json({ error }));
}

// Edit one creation by params.id
export function edit(req, res, next) {
  const creationObject = req.file
    ? {
        ...req.body,
        imageUrl: req.file.filename,
      }
    : { ...req.body };

  Creation.query()
    .findOne({ id: req.params.id })
    .then((creation) => {
      // test if the userId of creation object is the user authentified and if the user is not admin
      if (
        creation.author != req.auth.id &&
        !req.auth.roles.levels.includes(50, 99)
      ) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Delete the previous image
        if (creationObject.imageUrl !== undefined) {
          let path = `public/assets/images/users/${creation.author}/creations/${creation.imageUrl}`;
          if (fs.existsSync(path))
            fs.unlink(path, (err) => {
              if (err) {
                return res.status(422).json({
                  message: err,
                });
              }
            });
        }
        let err = security(creationObject);
        if (err)
          return res.status(422).json({
            message: "Security problem with the value of your inputs",
          });

        Creation.query()
          .updateOne(
            { _id: req.params.id },
            { ...creationObject, _id: req.params.id }
          )
          .then(() => res.status(200).json({ message: "Creation edited !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

// Delete creation by params.id
export function del(req, res, next) {
  Creation.query()
    .findById(req.params.id)
    .withGraphJoined("images")
    .then((creation) => {
      // if the user isn't the owner of the creation
      if (creation.user_id !== req.id)
        return res.status(401).json({ message: "Not authorized" });

      // Unrelate relations
      creation
        .$relatedQuery("filters")
        .unrelate()
        .then(() => {
          return clear(creation);
        })
        .catch((error) => {
          return res.status(400).json({ error });
        });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
}
