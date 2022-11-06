// requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose")

// initialising app and paths
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
app.set("views", path.join(__dirname, "/public/views"))

// db connection
mongoose.connect("mongodb+srv://admin-sunny:Todo9139@cluster0.qsfwkfe.mongodb.net/todolistDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(res => console.log("DB connected"))
  .catch(err => console.log("DB connection failure"))

// creating items schema
const itemsSchema = new mongoose.Schema({
  name: String
});

const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

// creating model
const Item = new mongoose.model("Item", itemsSchema);

const List = new mongoose.model("list", listsSchema);

const item1 = new Item({
  name: "Wake up"
});

const item2 = new Item({
  name: "Go work"
});

const item3 = new Item({
  name: "Sleep"
});

const defaultItems = [item1, item2, item3];


app.get("/", (req, res) => {

  // render items from DB
  Item.find({}, ((err, data) => {
    if (data.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err)
          console.log(err);
        else
          console.log("Success entry");
      })

      res.redirect("/");
    }
    else
      res.render("index", { listTitle: "Today", newlistItems: data })
  }))


})

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

})

// delete
app.post("/delete", (req, res) => {
  const checkeditem = req.body.checkbox;

  Item.findByIdAndRemove(checkeditem, err => {
    if (!err) {
      console.log("Deleted");
      res.redirect("/");
    }
  })

})

// dynamic routing using express route params
app.get("/:route", (req, res) => {
  const customList = req.params.route;

  List.findOne({ name: customList }, (err, data) => {
    if (!err) {
      if (!data) {

        const list = new List({
          name: customList,
          items: defaultItems
        })

        list.save();
        res.redirect("/" + customList);
      }
      else
        res.render("index", { listTitle: customList, newlistItems: data.items })
    }
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port 3000"))