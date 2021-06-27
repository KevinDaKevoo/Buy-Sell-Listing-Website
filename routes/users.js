/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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

router.get("/login", (res, req) => {
  res.render("login");
});

/*
router.post("/login", (res, req) => {

});

router.get("/register", (res, req) => {
  res.render("register");
});

router.post("/register", (res, req) => {

});

router.get("/product/:product_id", (res, req) => {
  res.render("product")
});

router.post("/product/:product_id", (res, req) => {

});

router.get("/message/:user_id", (res, req) => {
  res.render("message")
});

router.get("/product/:product_id/message", (res, req) => {
  res.render("new_message")
});

router.post("/product/:product_id/message", (res, req) => {

});

router.get("/favourite/:user_id", (res, req) => {
  res.render("favourite")
});

router.post("/products/favourite/:user_id/:product_id", (res, req) => {

});

router.get("/logout", (res, req) => {

})
*/