// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(cookieParser());

const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
// const widgetsRoutes = require("./routes/widgets");

app.use("/users", usersRoutes(db));
app.use("/admin", adminRoutes(db));

//Render home page with featured and not featured products
app.get("/", (req, res) => {
  db.query(`SELECT * FROM products ORDER BY id DESC;`)
    .then((data) => {
      const products = data.rows;
      const user_email = req.session.user_email;
      const templateVars = { user_email, products };
      res.render("index", templateVars);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
