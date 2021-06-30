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

  router.get("/login", (req, res) => {
    console.log("entering route:");
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

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const values = [email];
    const sqlQuery = `SELECT * FROM users WHERE email = $1`;
    return db
      .query(sqlQuery, values)
      .then((data) => {
        // console.log(data.rows)
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

  router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/users/login");
  });

  router.post("/product/:product_id/favorites", (req, res) => {
    //extract product.id from url
    const productId = req.params.product_id;
    console.log("This is productId", productId);
    //get user.id from cookies
    // const userId = req.session.user_id
    const userId = req.session.user_id;
    //create sql query to insert favourite into database
    const sqlQuery = `INSERT INTO favorite_products (product_id, user_id) VALUES ($1, $2)`;
    const values = [productId, userId];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("ADDED TO FAVS:", data);
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
    //redirect to "/"
    // res.render("product")
  });

  router.get("/favourite", (req, res) => {
    const sqlQuery = `SELECT favorite_products.id AS favorite_id, products.photo_1, products.name, products.price, products.id AS product_id, user_id FROM favorite_products INNER JOIN products ON products.id = favorite_products.product_id
WHERE favorite_products.user_id= $1;`;

    const values = [req.session.user_id];
    // console.log("this is req.session", req.session)
    console.log("this is values in the favourtie get route", values);
    db.query(sqlQuery, values)
      .then((data) => {
        const user_email = req.session.user_email;
        const user_id = req.session.user_id;
        const templateVars = { favorites: data.rows, user_id, user_email };
        res.render("favourite", templateVars);
      })
      .catch((error) => {
        console.log("this is error:", error);
      });
    // res.render("favourite", templateVars)
  });

  router.post("/favourite/:favorite_product_id/delete", (req, res) => {
    console.log(req.params);
    console.log("in the delete fav route");
    const sqlQuery = `DELETE FROM favorite_products WHERE id = $1;`;
    console.log("this is req params ", req.params.favorite_product_id);
    const values = [req.params.favorite_product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("DATA IS HERE");
        console.log("Query done");
        res.redirect("/users/favourite/");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  router.get("/product/:product_id", (req, res) => {
    const product_id = req.params.product_id;
    const sqlQuery = `SELECT * FROM products WHERE id = $1`;
    const values = [product_id];
    db.query(sqlQuery, values)
      .then((data) => {
        console.log("in the .then of the promise");
        const user_email = req.session.user_email;
        const product = data.rows[0];
        console.log("this is data:", product);
        const templateVars = { product: product, user_email };
        res.render("product", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  });

  router.get("/message/:user_id", (req, res) => {
    res.render("message");
  });

  router.get("/product/:product_id/message", (req, res) => {
    // console.log(req.params.product_id);
    // // console.log(req.session)
    // res.render("new_message")
    // const user_email = req.session.user_email;
    // const userId = req.session.user_id;
    //   const productId = req.params.product_id;
    //   console.log("THIS IS USERID AND PRODUCTID", userId, productId);
    //   const sqlQuery = `SELECT products.name AS product_name, products.seller_id AS seller_id, products.price AS product_price, products.description AS product_description, products.photo_1, messages.* from messages JOIN products ON products.id = product_id WHERE user_id = 2 AND product_id = 12;`;
    //   const values = [userId, productId];
    //   db.query(sqlQuery, values)
    //     .then((data) => {
    //       console.log("data outside userID:", data);
    //       if (userId) {
    //         console.log("DATA ROWS: in product message get route ", data);
    //         const product = data.rows[0];
    //         const templateVars = { user_email, userId, product };
    //         res.render("new_message", templateVars);
    //       } else {
    //         res.send("Please login as a user!");
    //       }
    //     })
    //     .catch((err) => {
    //       res.status(500).json({ err: err.message });
    //     });
  });

  router.post("/product/:product_id/message", (req, res) => {
    const sqlQuery = `INSERT INTO messages (user_id, content, product_id) VALUES ($1, $2, $3);`;
    const userId = req.session.user_id;
    const message = req.body;
    const productId = req.params.product_id;
    const values = [userId, message, productId];
    db.query(sqlQuery, values)
      .then((data) => {
        res.redirect("/product/:product_id/message");
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
    res.redirect("/");
  });

  return router;
};

/*


/* SELECT products.name, products.seller_id, products.price, products.description, products.photo_1, messages.* from messages JOIN products ON products.id = product_id WHERE user_id = 2 AND product_id = 12;


INSERT INTO message (user_id, content, product_id) VALUES ($1, $2, $3)

insert into messages (user_id, content, product_id) VALUES (1, 'hello is this sold yet?', 12)

router.get("/product/:product_id/message", (req, res) => {
  res.render("new_message")
});


r

router.post("/products/favourite/:user_id/:product_id", (req, res) => {

});
SELECT products.*, messages.* FROM products INNER JOIN messages ON messages.product_id = products.id;


*/
