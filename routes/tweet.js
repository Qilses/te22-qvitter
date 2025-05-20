import express, { Router } from "express";
import db from "../db-sqlite.js";
import { body, matchedData, validationResult } from "express-validator";
import bcrypt from "bcrypt";


const router = express.Router();

// Routes
router.get("/", async (req, res) => {
    const tweets = await db.all(
        `   
        SELECT tweet.*, name 
        FROM tweet
        JOIN user
        ON tweet.author_id = user.id;
    `
    );
    if (req.session.loggedin === true) {
        console.log("Andvändare In logg:", req.session.loggedin);
        res.render("tweet.njk", { title: "Alla Qvitts", username: req.session.user, message: "Qvitter", tweets });
    } else {
        res.render("login.njk", { title: "Logga in innan du fortsätter", message: ":D" });
    }
});

router.get("/login", async (req, res) => {
    res.render("login.njk", {
        title: "Logga in!",
        message: "Skriv in ditt användarnamn, email och lösenord för att logga in",
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get("SELECT * FROM user WHERE name = ?", username);

    if (user == undefined) {
        res.render("login.njk", {
            title: "Logga in!",
            message: "Username or password wrong!"
        });
    } else {
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (isMatch) {
                Object.assign(req.session, {
                    loggedin: true,
                    user: username,
                    author_id: user.id
                });
                res.render("index.njk", { title: "Qvitter", message: "Välkommen: " + user.name });
            } else {
                res.render("login.njk", {
                    title: "Logga in!",
                    message: "Username or password wrong!",
                });
            }
        });
    }
});

router.get("/:id/delete", async (req, res) => {
    const id = req.params.id;
    await db.run("DELETE FROM tweet WHERE id = ?", [id]);
    res.redirect("/tweets");
});

router.get("/new", (req, res) => {
    res.render("new.njk", {
        title: "Testa att skapa DIN qvitt!",
        message: "Twitter finns inte!",
    });
});

router.post('/new', async (req, res) => {
    if (req.session.loggedin === true) {
        const { message } = req.body;
        const author_id = req.session.author_id;

        await db.run(
            'INSERT INTO tweet (message, author_id) VALUES (?, ?)',[message, author_id]
        );
        console.log(message)
        res.redirect('/tweets');
    } else {
        res.render('login.njk', { title: 'Logga in innan du fortsätter', message: ':D' });
    }
});

router.get("/newuser", (req, res) => {
    res.render("newuser.njk", {
        title: "CREATE A NEW USER!",
        message: "Set a Username, password and a email to create a new user :)"
    })
})

router.post("/newuser", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get(
        "SELECT * FROM user WHERE name = ?", username

    );
    console.log(req.body)

    if (user === true) {
        res.render("newuser.njk", {
            title: "user exist pls try gin",
            message: "Username or password wrong!"
        })
    } else {
        try {
            const hash = await bcrypt.hash(password, 10);
            await db.run('INSERT INTO user (name, password) VALUES (?, ?)', username, hash);
            res.render("login.njk", { title: "Andvändare Skapad", message: "Snälla logga in!" })
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal server error");
        }
    }
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