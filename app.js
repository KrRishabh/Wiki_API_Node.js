const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true}, {useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

//For accessing all the articles in the database

app.route('/articles')
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
      console.log('Get method on all articles was called');
      console.log(foundArticles);
    }
    else{
      console.log(err);
    }
  })
})
.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send('Successful');
      console.log('Data saved!');
    }
  });

})
.delete(function(req, res){
  Article.delelteMany(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send('delete successful');
    }
  });
});


//For accessing a specific articles

app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("no article found");
    }
  })
})
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        console.log("Successfully updated the article -  "+req.params.articleTitle);
        res.send("Successfully updated the article -  "+req.params.articleTitle);
      }
    }
  );
})
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Article patched");
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted");
      }
    }
  );
});


app.listen(3000, function(){
  console.log('server started at port 3000');
});
