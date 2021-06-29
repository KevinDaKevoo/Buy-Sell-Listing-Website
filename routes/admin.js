const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then((data) => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  router.get("/add_listing", (req, res) => {
    const userId = req.session.user_id;
    const user_email = req.session.user_email;
    const templateVars = { userId, user_email };
    if (userId === 1) {
      res.render("admin_product", templateVars);
    } else {
      res.send("You are not an admin!");
    }
  });

  router.post("/add_listing", (req, res) => {
    const info = req.body;
    const name = info.name;
    const sellerId = info.seller_id;
    const typeId = info.type_id;
    const photo = info.photo_1;
    const price = info.price;
    const description = info.description;
    // console.log(name, sellerId, typeId, photo, price, description);
    const sqlQuery = `INSERT INTO products (name, seller_id, type_id, photo_1, price, description) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [name, sellerId, typeId, photo, price, description];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("this is data: ", data);
        const user_email = req.session.user_email;
        const userId = req.session.user_id;
        const templateVars = { user_email, userId };
        res.redirect("/");
        console.log(data);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  router.post("/:product_id/delete", (req, res) => {
    const sqlQuery = `DELETE FROM products WHERE id = $1;`;
    console.log("this is req params ", req.params.product_id);
    const values = [req.params.product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("DATA IS HERE ---- DELETE PRODUCT FOR ADMIN");
        console.log("Query done");
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  router.post("/:product_id/sold", (req, res) => {
    const sqlQuery = `UPDATE products SET photo_1 = 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/sold-out-stamp-design-template-73e2343e49d21299312961eb3f631da7_screen.jpg?ts=1609019232' WHERE id = $1;`;
    const values = [req.params.product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  return router;
};

// INSERT INTO products (seller_id, type_id, name, is_available, description, photo_1, price, is_featured)
// VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

/*
router.get("/admin/products", (req, res) => {
  res.render("admin_products")
});

router.get("/admin/products/product_id", (req, res) => {
  res.render("admin_product_edit")
});

router.post("/admin/product_id/delete", (req, res) => {

});

router.post("/admin/product_id/sold", (req, res) => {

});

router.get("/admin/logout", (req, res) => {

});
*/
