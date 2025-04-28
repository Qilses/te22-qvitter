import express, { Router } from "express"
import pool from "../db.js"
import { body, matchedData, validationResult } from "express-validator"
import bcrypt from "bcrypt" 

const router = express.Router()


//routes här under, Index.njk är default route.
router.get("/", async (req, res) => {
    const [tweets] = await pool.promise().query(
        `   
        SELECT tweet.*, user.name 
        FROM tweet
        JOIN user
        ON tweet.author_id = user.id;
    `
    )
    res.render("tweet.njk", { title: "Alla Qvitts", message: "Qvitter", tweets })
})


router.get("/:id/delete", async (req, res) => {
    const id = req.params.id
    body("id").isInt(),

    
    await pool.promise().query("DELETE FROM tweet WHERE id = ?", [id])
    res.redirect("/")
})

router.get("/new", (req, res) => {
    res.render("new.njk", {
        title: "Testa att skapa DIN qvitt!",
        message: "Twitter finns inte!",
    })
})


router.post("/new", async (req, res) => {
    const message = req.body.message
    const author_id = 1
    await pool
      .promise()
      .query("INSERT INTO tweet (message, author_id) VALUES (?, ?)", [
        message,
        author_id,
      ])
    res.redirect("/")
})
Router


router.get("/:id/edit", async (req, res) => {
    const id = req.params.id
    if (!Number.isInteger(Number(id))) { return res.status(400).send("Invalid ID") }
    const [rows] = await pool.promise().query("SELECT * FROM tweet WHERE id = ?", [id])
    if (rows.length === 0) {
      return res.status(404).send("Tweet not found")
    }
    res.render("edit.njk", { tweet: rows[0] })
  })

router.post("/edit",
    body("id").isInt(),
    body("message").isLength({ min: 1, max: 130 }),
    body("message").escape(),
    async (req, res) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) { return res.status(400).send("Invalid input") }
  
    const { id, message } = matchedData(req) // req.params.message varför inte?
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ")
    console.log(timestamp)
    await pool.promise().query("UPDATE tweet SET message = ?, updated_at = ? WHERE id = ?", [message, timestamp, id])
    res.redirect("/")
  })

  router.get("/login", async (req, res) => {
    res.render("login.njk", {
      title: "Logga in!",
      message: "Skriv in ditt användarnamn, email och lösenord för att logga in",
    });
  
  });
  

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // Hämta användare från databasen
    const [result] = await pool.promise().query(
        ` 
        SELECT * FROM users_login
        WHERE user_name = ?` , [username]
        
    );

    if (result[0] == undefined) {
        res.render("login.njk", {
            title: "Logga in!",
            message: "Username or password wrong!"
        })
    } else {
        bcrypt.compare(password, result[0].user_password, function (err, result) {
            if (result == true) {
                res.render("tweet.njk", {})

            } else {
                res.render("login.njk", {
                    title: "Logga in!",
                    message: "Username or password wrong!",
                })

            }
        });
    }
}

)

router.get("/newuser", (req, res) => {
    let user_password = password
    res.render("newuser.njk", {
        title: "CREATE A NEW USER!",    
        message:"Set a Username, password and a email to create a new user :)"
    })
    bcrypt.hash(user_password, 10, function (err, hash) {
        // här får vi nu tag i lösenordets hash i variabeln hash
        console.log(hash)
        
    })

})


export default router