/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        const current_user = req.session.user_email;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
//login route
  router.get("/login", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        const user_email = req.session.user_email;
        const templateVars = { user_email };
        return res.render("login", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
// post request to capture login information
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const values = [email];
    const sqlQuery = `SELECT * FROM users WHERE email = $1`;
    return db
      .query(sqlQuery, values)
      .then((data) => {
        const user = data.rows[0];
        if (user) {
          req.session.user_email = user.email;
          req.session.user_id = user.id;
          res.redirect("/");
        } else {
          res.send("Unauth access");
        }
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });
//deleting user session once user logs out
  router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/users/login");
  });
//inserting products into favourites list if user clicks on favorite this
  router.post("/product/:product_id/favorites", (req, res) => {
    const productId = req.params.product_id;
    const userId = req.session.user_id;
    const sqlQuery = `INSERT INTO favorite_products (product_id, user_id) VALUES ($1, $2)`;
    const values = [productId, userId];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Rendering the favourite page
  router.get("/favourite", (req, res) => {
    const sqlQuery = `SELECT favorite_products.id AS favorite_id, products.photo_1, products.name, products.price, products.id AS product_id, user_id FROM favorite_products INNER JOIN products ON products.id = favorite_products.product_id
WHERE favorite_products.user_id= $1;`;
    const values = [req.session.user_id];
    db.query(sqlQuery, values)
      .then((data) => {
        const user_email = req.session.user_email;
        const user_id = req.session.user_id;
        const templateVars = { favorites: data.rows, user_id, user_email };
        res.render("favourite", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Removing favourite product from user
  router.post("/favourite/:favorite_product_id/delete", (req, res) => {
    const sqlQuery = `DELETE FROM favorite_products WHERE id = $1;`;
    const values = [req.params.favorite_product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/users/favourite/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Product info page
  router.get("/product/:product_id", (req, res) => {
    const product_id = req.params.product_id;
    const sqlQuery = `SELECT * FROM products WHERE id = $1`;
    const values = [product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        const user_email = req.session.user_email;
        const product = data.rows[0];
        const templateVars = { product: product, user_email };
        res.render("product", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Rendering thenew message page
  router.get("/product/:product_id/message", (req, res) => {
    const user_email = req.session.user_email;
    const userId = req.session.user_id;
    const productId = req.params.product_id;
    const sqlQuery = `SELECT * FROM products WHERE id = $1;`;
    const values = [productId];
    db.query(sqlQuery, values)
      .then((data) => {
        const product = data.rows[0];
        const templateVars = { user_email, userId, product };
        res.render("new_message", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

//creating a new message for the product
  router.post("/product/:product_id/message", (req, res) => {
    const sqlQuery = `INSERT INTO messages (user_id, content, product_id) VALUES ($1, $2, $3);`;
    const userId = req.session.user_id;
    const message = req.body.name;
    const productId = req.params.product_id;
    const values = [userId, message, productId];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

//Rendering the messages page
  router.get("/messages", (req, res) => {
    let values = [];
    const userId = req.session.user_id;
    let sqlQuery = ``;
    if (userId == 1) {
      sqlQuery = `SELECT * FROM messages WHERE is_for_admin = $1 ORDER BY messages.id DESC;`;
      values = [true];
    } else {
      sqlQuery = `SELECT is_for_admin, content, products.id AS product_id, products.seller_id, products.name, products.price AS price, user_id, users.name AS user_name
      FROM messages
      JOIN products ON products.id = messages.product_id
      JOIN users ON users.id = messages.user_id
      WHERE user_id = $1 OR products.seller_id = $2
      ORDER BY messages.id DESC;`;
      values = [userId, userId];
    }
    const user_email = req.session.user_email;
    db.query(sqlQuery, values)
      .then((data) => {
        const messages = data.rows;
        const templateVars = { user_email, userId, messages };
        res.render("message", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Replying messages
  router.post("/product/reply", (req, res) => {
    const sqlQuery = `INSERT INTO messages (user_id, content, product_id, is_for_admin) VALUES ($1, $2, $3, $4);`;
    const userId = req.session.user_id;
    const message = req.body.name;
    let isAdmin = false;
    const productId = req.body.contactId;
    if (productId === "1") {
      isAdmin = true;
    }
    const values = [userId, message, productId, isAdmin];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/users/messages");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  //Filtering products by price
  router.post("/filter", (req, res) => {
    let sqlQuery = `SELECT products.id, products.name as product_name, products.price AS product_price, products.description as description, products.photo_1 as product_photo FROM product_types JOIN products ON products.type_id = product_types.id`;
    const min = req.body.minprice;
    const max = req.body.maxprice;
    const values = [];
    if (min && !max) {
      sqlQuery += ` WHERE products.price > $1 ORDER BY products.price;`;
      values.push(min);
    } else if (!min && max) {
      sqlQuery += ` WHERE products.price < $1 ORDER BY products.price;`;
      values.push(max);
    } else if (!min && !max) {
      sqlQuery += ` WHERE products.price > 0 ORDER BY products.price;`;
    } else {
      sqlQuery += ` WHERE products.price > $1 and products.price < $2 ORDER BY products.price;`;
      values.push(min);
      values.push(max);
    }
    const user_email = req.session.user_email;
    const userId = req.session.user_id;
    db.query(sqlQuery, values)
      .then((data) => {
        const products = data.rows;
        const templateVars = { userId, user_email, products };
        res.render("filter", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  return router;
};
