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


export default router