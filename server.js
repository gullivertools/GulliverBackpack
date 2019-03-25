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
app.use(session({
    secret: "secret"
}));

const postHeaders = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'mybackpack.gulliverschools.org',
    'Origin': 'https://mybackpack.gulliverschools.org',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

const {
    getGrades,
    getFullGrades
} = require('./middlewares/grades');

app.get('/', function (req, res) {
    // check to see if logged in
    console.log('cookies: ', req.cookies);

    if (!req.cookies["user-info"]) // if user is not logged in
        return res.redirect('/login')

    res.redirect('/home');
});

app.get('/home', async function (req, res) {
    // get grades
    let grades = await getGrades(req.cookies['user-info']);

    res.status(200).render('pages/home', {
        data: {
            grades: grades,
            imports: `<script src="/js/gradebook.js"></script>`
        }
    });

});

app.get('/test', async function (req, res) {
    let grades = await getFullGrades(req.cookies['user-info'], 'q4');
    res.status(200).send("hi");
})

app.get('/login', function (req, res) {
    res.status(200).render('pages/login', {
        data: {
            imports: `<link rel="stylesheet" type="text/css" media="screen" href="/css/login.css">`
        }
    });
});

app.post('/login', function (req, res) {
    let json = req.body;
    console.log('json:', json);

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

app.post('/fetchGrades', function (req, res) {
    console.log('grades from: ', req.body);
    getFullGrades(req.cookies['user-info'], req.body["grades"])
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));