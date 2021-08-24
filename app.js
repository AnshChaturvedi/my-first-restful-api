const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// Just to redirect and not have to constantly type in "/articles" in testing environment :)
app.get("/", (req, res) => {
    res.redirect("/articles")
});

// App route handler for the "/articles" route
app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, articles) => {
            if (err) {
                res.send(err);
            } else {
                res.send(articles);
            }
        });
    })

    .post((req, res) => {
        const newArticleToAdd = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticleToAdd.save().then(() => {
            res.send("Added successfully.")
        }).catch(err => {
            res.send(err);
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err => {
            if (err) {
                res.send(err);
            } else {
                res.send("Deleted everything.");
            }
        }));
    });

app.route("/articles/:article")
    .get((req, res) => {
        
        Article.findOne({title: req.params.article}, (err, article) => {
            if (err) {
                res.send(err);
            } else if (article) {
                res.send(article);
            } else {
                res.send("No matching articles found.")
            }
        });
    })
    
    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.article}, 
            {title: req.body.title, content: req.body.content}, 
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
        })
    
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.article}, 
            {$set: req.body}, 
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.body.title}, (err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        });
    });

app.listen(3000, (req, res) => {
    console.log("Server running on port 3000...");
});