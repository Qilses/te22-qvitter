import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import bodyParser from "body-parser"
import logger from "morgan"
  
import tweetRouter from "./routes/tweet.js"

const app = express()
const port = 3000

//säger till att sevrver kan andvända sig av ditt och datt mappar
app.use(express.static("public"))


app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))


nunjucks.configure('views', {
  autoescape: true,
  express: app,
})


app.get("/", async (req, res) => {
  res.render("index.njk", {
    title: "Hello World",
    message: "Hello World",
  })
})

//säger till servern att den ska andvända routes mappen

app.use("/tweets", tweetRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})