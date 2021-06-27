const express = require('express');
const router  = express.Router();


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
router.get("/admin", (res, req) => {
  res.render("admin")
});

router.get("/admin/products", (res, req) => {
  res.render("admin_products")
});

router.get("/admin/products/product_id", (res, req) => {

});

router.post("/admin/product_id/delete", (res, req) => {

});

router.post("/admin/product_id/sold", (res, req) => {

});

router.get("/logout", (res, req) => {

});
*/