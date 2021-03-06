import express from "express";
const app = express();
const port = 8000;
export const URL = `http://localhost:${port}`;
import cors from "cors";
import models, { sequelize } from "./models";
import auth from "./routes/auth";
import user from "./routes/user";
import post from "./routes/post";
import protect from "./middleware/auth";
import dotenv from "dotenv";
import upload from "./upload";
import path from "path";
import insertFakedata from "./faker";
const bodyParser = require("body-parser");

const eraseDatabaseOnSync = true;
dotenv.config();

//static path
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//middlewares
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.context = {
    models,
    user: {},
  };
  next();
});

//testing uploads
app.post("/upload", upload.single("profilePic"), (req, res) => {
  res.send("posted");
});

//routers
app.use("/auth", auth);
app.use("/post", post);
app.use("/user", user);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/me", protect, async (req, res) => {
  let models = req.context.models;
  let user = req.context.user;

  console.log(user);
  res.send({ user });
});

app.get("*", function (req, res, next) {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);

  error.statusCode = 301;

  next(error);
});

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  return res
    .status(error.statusCode)
    .json({ error: error.toString() || "Bad Request" });
});

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  insertFakedata();
});
