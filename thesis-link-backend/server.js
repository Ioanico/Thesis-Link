const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { auth, theses, users } = require("./src/api");
const { verifyToken } = require("./src/utils/middlewares");

const app = express();
const port = 3000;

const mongo_uri = process.env.MONGO_URI;
mongoose
    .connect(mongo_uri, {
        dbName: "thesis-link",
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(cors());

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        app.use("/images", express.static("public/images"));
        app.use("/auth", auth);
        app.use("/theses", verifyToken, theses);
        app.use("/users", verifyToken, users);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
