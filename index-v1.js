const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("views", path.join(__dirname, "/public/views"))

// 
let items = [];
let workItems = [];

app.get("/", (req, res) => {

  let day = date.getDate();

  res.render("index", { listTitle: day, newlistItems: items })

})

app.post("/", (req, res) => {
  let newItem = req.body.newItem;

  if (req.body.list === "Work List") {
    workItems.push(newItem);
    res.redirect("/work");
  }
  else {
    items.push(newItem)
    res.redirect("/");
  }
})

app.get("/work", (req, res) => {
  res.render("index", { listTitle: "Work List", newlistItems: workItems })
})

app.listen(3000, () => console.log("Running on port 3000"))