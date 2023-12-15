const express = require('express');
const bodyParser = require('body-parser')
const urlencoded = bodyParser.urlencoded({extended:false})
const Sequelize = require('sequelize');
const app = express();
const TelegramBot = require('node-telegram-bot-api');
app.use(express.static('public'))

const token = '6570460337:AAFler9l5tKFcagv0pC18MivIFfaSXircoo';
const bot = new TelegramBot(token, {polling: true});

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
        type: Sequelize.TEXT,
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

app.post('/blogs', urlencoded, function(req, res) {
    const name = req.body.name;
    const text = req.body.text;
    const date = req.body.date;

  
    Post.create({name: name, descript: text, date_post:date}).then(() => {
        bot.sendMessage(672863020,"Создано: "+name),
        res.redirect('/blogs');  
    })
});

app.get('/delete/:id', function(req, res){
    const postsId = req.params.id;
    Post.destroy({
        where: {
            id: postsId
        }
    }).then(() => {
        bot.sendMessage(672863020,"Удалено: "+postsId),
        res.redirect('/blogs');
    })
});


app.post('/update', urlencoded, function(req, res) {
    let id = req.body.id;
    const name = req.body.name;
    const text = req.body.text;
    const date = req.body.date;

    Post.update({name: name, descript: text, date_post:date}, {
        where: {
            id: id
        }
    }).then(() => {
        bot.sendMessage(672863020,"Изменено: "+name),
        res.redirect('/blogs');

        
    })
});

app.get('/update/:id', function(req, res) {
    Post.findOne({
        where: {
            id: req.params.id
        }
    }).then((date) => {
        res.render('update.hbs', {posts: date})
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



bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, msg.text);
});