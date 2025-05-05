import "dotenv/config"
import express from "express"
import nunjucks from "nunjucks"
import bodyParser from "body-parser"
import morgan from "morgan"
import tweetRouter from "./routes/tweet.js"
import session from "express-session"

const app = express()
const port = 3000
const saltRounds = 10;

//säger till att sevrver kan andvända sig av ditt och datt mappar
app.use(express.static("public"))


app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  secret: `keyboard cat`,
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))
nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.get("/", async (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views =  1
  }
  
  console.log(req.session.views)

  if (req.session.loggedin === true) {  
    console.log("Andvändare ÄR inloggad", req.session.loggedin)
    res.render("index.njk", {
      title: "Hello World",
      message: "Hello World",
  
    })
  } else {
    console.log("Andvändare INTE inloggad")
    res.render("login.njk", {
      title: "Logga in!",
      message: "Username or password wrong!"
  })
  }

  
})
//säger till servern att den ska andvända routes mappen

app.use("/tweets", tweetRouter)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})