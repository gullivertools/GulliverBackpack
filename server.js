const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = process.env.PORT || 3000; // this is just for heroku support
var requests = require('request');
const cheerio = require('cheerio');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded()); // use body parser to retrieve post request bodies
app.use(cookieParser());
app.use(session({secret: "secret"}));

const { getGrades } = require('./middlewares/grades');

app.get('/', function (req, res) {
    // check to see if logged in
    console.log('cookies: ', req.cookies);

    if(!req.cookies["user-info"]) // if user is not logged in
        return res.redirect('/login')

    res.redirect('/home');
});

app.get('/home', async function(req, res) {
    // get grades
    let grades = await getGrades(req.cookies['user-info']);

    res.status(200).render('pages/home', {data: {
        grades: grades,
        imports:
        `<script src="/js/gradebook.js"></script>`
    }});
    
});

app.get('/login', function(req, res) {
    res.status(200).render('pages/login', {
        data: {
            imports:
            `<link rel="stylesheet" type="text/css" media="screen" href="/css/login.css">`
        }
    });
});

app.post('/login', function (req, res) {
    let json = req.body;
    console.log('json:', json);
    res.cookie("user-info", {"username": json.username, "password": json.password}); // adds cookie
    console.log("cookies: ", req.cookies);
    if (!json.username || !json.password) {
        res.statusCode = 400
        res.send("wrong format!")
        return
    } else {
        // console.log("right!")
        getLoginBeforeCheck(json.username, json.password, res);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));