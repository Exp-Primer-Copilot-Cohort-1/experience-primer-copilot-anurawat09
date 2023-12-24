//create a web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/comments');
var Comment = require('./model/commentssModel');
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var commentRouter = express.Router();

commentRouter.route('/Comments')
    .post(function(req,res){
        var comment = new Comment(req.body);
        comment.save();
        res.status(201).send(comment);
    })
    .get(function(req,res){

        var query = {};

        if(req.query.name)
        {
            query.name = req.query.name;
        }
        Comment.find(query,function(err,comments){
            if(err)
                res.status(500).send(err);
            else
                res.json(comments);
        });
    });

commentRouter.route('/Comments/:commentId')
    .get(function(req,res){

        Comment.findById(req.params.commentId,function(err,comment){
            if(err)
                res.status(500).send(err);
            else
                res.json(comment);
        });
    });
app.use('/api',commentRouter);

app.get('/',function(req,res){
    res.send('welcome to my API');
});

app.listen(port,function(){
    console.log('Gulp is running my app on PORT: ' + port);
});