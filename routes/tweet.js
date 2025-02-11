import express from "express"
import pool from "../db.js"

const router = express.Router()


//routes här under 
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

router.get("/user", (req, res) => {
   `
        SELECT tweet.*, user.name 
        FROM tweet
        JOIN user
        ON tweet.author_id = user.id;
        `
    res.render("user.njk", {
        title: "Vem är du?"
        
    })
})


export default router