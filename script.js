const express = require('express');
const bodyParser = require('body-parser')
const urlparser = bodyParser.urlencoded({extended: false});
const Sequelize = require('sequelize');
const app = express();
app.use(express.static('public'))


app.set("view engine", "hbs")
const sequelize = new Sequelize("blog", "root", "", {
    dialect: 'mysql',
    host: 'localhost',
});

// Define the Tags model
const Tag = sequelize.define('tags', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

// Define the Posts model
const Post = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descript: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    date_post: {
        type: Sequelize.DATE,
        allowNull: false,
    },
});

Post.hasOne(Tag, { onDelete: "cascade" });



app.get('/blogs',  function(req, res) {
    Post.findAll({
         include:[{
             model:Tag,
             attributes:["name"]
         }]
    }).then((date)=>{
        res.render('blogs.hbs', {posts: date})
    })
    
});


app.get('/works', function(req, res) {
    res.render('works.hbs');
});

app.get('/work-detailed', function(req, res) {
    res.render('work-detailed.hbs');
});

app.get('/', function (req, res){
    res.render("index.hbs")
});

sequelize.sync().then(() => {
    app.listen('3000');
})


