import express from "express";
import bodyParser from "body-parser";
import knex from "./db/db.js"; // retrieves the values from the env file for each file in the project and links objection to knex
import User from "./models/user.js";
import bcrypt from "bcrypt";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import { logger } from "./middleware/logEvents.js";
import errorHandler from "./middleware/errorHandler.js";
import verifyJWT from "./middleware/verifyJWT.js";
import credentials from "./middleware/credentials.js";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use(bodyParser.json()); // Recover the post request in json

app.use(bodyParser.urlencoded({ extended: true })); // true if we need more than string in urlencoded

app.use(cookieParser());

app.use((req, res, next) => {
  helmet({
    crossOriginEmbedderPolicy: false,
  });

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  res.setHeader("Access-Control-Allow-Origin", process.env.AUDIENCE);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

import { default as authRoutes } from "./routes/auth.js";
import { default as userRoutes } from "./routes/user.js";
import { default as creationRoutes } from "./routes/creation.js";
import { default as filterRoutes } from "./routes/filter.js";
import refreshRoutes from "./routes/refresh.js";

app.use(
  "/",
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "./public")
  )
);

app.use("/api/auth", authRoutes);
app.use("/api", refreshRoutes);

app.use(verifyJWT);

app.use("/api/user", userRoutes);
app.use("/api/creations/filters", filterRoutes);
app.use("/api/creations", creationRoutes);

app.get("/404", function (req, res) {
  res.status(404).json("Page not found.");
});

User.query()
  .findOne({ email: process.env.ADMIN_DEFAULT_EMAIL })
  .then((user) => {
    if (!user) {
      // If the first admin is not already created
      bcrypt
        .hash(process.env.ADMIN_DEFAULT_PASSWORD, 10) // Encrypt the password
        .then((hash) => {
          const user = {
            firstname: "Brice",
            lastname: "Seraphin",
            email: process.env.ADMIN_DEFAULT_EMAIL,
            phone: 1234,
            password: hash,
            roles: {
              levels: [
                Number(process.env.ADMIN),
                Number(process.env.SUPER_ADMIN),
              ],
            }, // Admin and SuperAdmin User
          };

          User.query()
            .insert(user)
            .then((user) => {
              console.log("Welcome, " + user.fullName());
            })
            .catch((message) => {
              console.log("Error : " + message);
            });
        });
    }
  });

app.use(errorHandler);

export default app;
