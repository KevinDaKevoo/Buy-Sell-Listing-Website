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
        const current_user = req.session.user_email;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });      
  });

  router.get("/login", (req, res) => {
    console.log('entering route:');
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        const user_email = req.session.user_email;
        const templateVars = { user_email };
        return res.render("login", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({error: err.message});
      });
    
  });
  
  router.post("/login", (req, res) => {
    const email = req.body.email;
    const values = [email];
    const sqlQuery = `SELECT * FROM users WHERE email = $1`;
    return db.query(sqlQuery, values)
      .then(data => {
        const user = data.rows[0];
        if (user) {
          console.log("I am here");
          req.session.user_email = user.email;
          console.log(req.session.user_email);

          res.redirect("/"); //may be res.render("index") - try it now?
        } else {
          res.send("Unauth access");
        }
      }) //maybe in /login get needs res.session.user_email?
      .catch(err => {
        res
          .status(500)
          .json({err: err.message});
      });

    // return res.redirect("/");
  });

  router.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });
  
  return router;
};


/*
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


*/