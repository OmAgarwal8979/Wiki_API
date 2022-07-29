const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

//all articles

app.route("/articles")

    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (err) throw err;
            res.send(foundArticles);
        });
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (err) throw err;
            res.send("Succesfully added new Article");
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (err) throw err;
            res.send("Succesfully deleted all articles");
        })
    });

//specific article

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (err) throw err;
            else if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No article matching the title was found!");
            }
        });
    })

    .put(function (req, res) {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (err) throw err;
                res.send("Successfully updated article");
            }
        );
    })

    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (err) throw err;
                res.send("Changed Field(s) Successfully");
            }
        );
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (err) throw err;
                res.send("Successfully Deleted");
            }
        );
    });

app.listen("3000", function () {
    console.log("Server started at port 3000");
});