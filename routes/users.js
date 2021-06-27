/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const cookieParser = require('cookieParser');

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

/*
app.get("/login", (res, req) => {

});

app.post("/login", (res, req) => {

});

app.get("/register", (res, req) => {

});

app.post("/register", (res, req) => {

});

app.get("/product/:product_id", (res, req) => {

});

app.post("/product/:product_id", (res, req) => {

});

app.get("/message/:user_id", (res, req) => {

});

app.get("/product/:product_id/message", (res, req) => {

});

app.post("/product/:product_id/message", (res, req) => {

});

app.get("/favourite/:user_id", (res, req) => {

});

app.post("/products/favourite/:user_id/:product_id", (res, req) => {

});
*/