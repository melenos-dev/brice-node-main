import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as Security from "./security.js";
import crypto from "crypto";

function security(email, password) {
  if (!Security.mail(email))
    return "Security problem with the value of your mail";
  if (!Security.password(password))
    return "Incorrect password. He must have at least 1 number, 6 characters, uppercase letter, no space, and a maximum of 100 characters.";
  return false;
}

// Add a new user
export function signup(req, res, next) {
  let err = security(req.body.email, req.body.password);
  if (err)
    return res.status(422).json({
      message: err,
    });
  bcrypt
    .hash(req.body.password, 10) // Encrypt the password
    .then((hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        roles: { levels: 0 }, // Default User
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "User saved successfully !" })
        )
        .catch((message) => {
          console.log(message);
          res.status(409).json({ message });
        });
    })
    .catch((message) => res.status(500).json({ message }));
}

// Get one user by params.id
export function getById(req, res, next) {
  User.query()
    .findById(parseInt(req.params.id))
    .then((user) => res.status(200).json(user.fullName()))
    .catch(next);
}
