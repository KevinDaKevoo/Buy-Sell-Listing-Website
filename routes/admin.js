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
app.get("/admin", (res, req) => {

});

app.get("/admin/products", (res, req) => {

});

app.get("/admin/products/product_id", (res, req) => {

});

app.post("/admin/product_id/delete", (res, req) => {

});

app.post("/admin/product_id/sold", (res, req) => {

});

app.get("/logout", (res, req) => {

});
*/