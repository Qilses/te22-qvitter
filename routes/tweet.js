import express, { Router } from "express"
import db from "../db-sqlite.js"
import { body, matchedData, validationResult } from "express-validator"
import bcrypt from "bcrypt"

const router = express.Router()

//routes här under, Index.njk är default route.
router.get("/", async (req, res) => {
    const tweets = await db.all(
        `   
        SELECT tweet.*, name 
        FROM tweet
        JOIN user
        ON tweet.author_id = user.id;
    `
    )
    console.log("Andvändare In logg:", req.session.loggedin)

    res.render("tweet.njk", { title: "Alla Qvitts", message: "Qvitter", tweets })

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
    const user = await db.get(
        "SELECT * FROM user WHERE name = ?", username

    );

    console.log(user);
    console.log(req.body);


    if (user == undefined) {
        res.render("login.njk", {
            title: "Logga in!",
            message: "Username or password wrong!"
        })
    } else {
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (isMatch) {
                req.session.loggedin = true;
                req.session.username = user.name;
                res.render("index.njk", { title: "Qvitter", message: "Välkommen: " + user.name });
            } else {
                res.render("login.njk", {
                    title: "Logga in!",
                    message: "Username or password wrong!",
                });
            }
        });
    }
})

router.get("/:id/delete", async (req, res) => {
    const id = req.params.id
    body("id").isInt(),


        await db.run("DELETE FROM tweet WHERE id = ?", [id])
    res.redirect("/")
})

router.get("/new", (req, res) => {
    // finns session?
    res.render("new.njk", {
        title: "Testa att skapa DIN qvitt!",
        message: "Twitter finns inte!",
    })
})


router.post("/new", async (req, res) => {
    // authot id i session
    console.log("AndvändareInlogg:", req.session.loggedin, username)

            const { author_id, message } = req.body;
            await db.run("INSERT INTO tweet (message, author_id) VALUES (?, ?)", message, author_id);
            res.redirect("/tweets");
      
})
Router

router.get("/newuser", (req, res) => {
    res.render("newuser.njk", {
        title: "CREATE A NEW USER!",
        message: "Set a Username, password and a email to create a new user :)"
    })
    let password = "robin";
    bcrypt.hash(password, 10, function (err, hash) {
        // här får vi nu tag i lösenordets hash i variabeln hash
        console.log(hash)

    })

})


router.get("/:id/edit", async (req, res) => {
    const id = req.params.id
    if (!Number.isInteger(Number(id))) { return res.status(400).send("Invalid ID") }
    const [rows] = await db.get("SELECT * FROM tweet WHERE id = ?", [id])
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
        await db.run("UPDATE tweet SET message = ?, updated_at = ? WHERE id = ?", [message, timestamp, id])
        res.redirect("/")
    })



export default router