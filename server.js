const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = process.env.PORT || 3000; // this is just for heroku support
var requests = require('request');
const cheerio = require('cheerio');
const { policy, CLIENT_ID, CLIENT_SECRET } = require('./secret.js');
const { url, getAccessToken, listCourses } = require('./middlewares/classroom');
const { getLoginPage } = require('./middlewares/gulliver');

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

const {
    getGrades,
    getFullGrades
} = require('./middlewares/grades');

app.get('/', function (req, res) {
    // check to see if logged in
    console.log('cookies: ', req.cookies);

    if (!req.cookies["user-info"]) // if user is not logged in
        return res.redirect('/login')

    res.redirect('/calendar');
});

app.get('/home', async function (req, res) {
    // get grades
    let grades = await getGrades(req.cookies['user-info']);
    // try and keep this in a cookie that lasts like a day

    res.status(200).render('pages/home', {
        data: {
            grades: grades,
            imports: `
            <script src="/js/gradebook.js"></script>
            <script src="/js/classroom.js"></script>`
        }
    });

});

app.get('/calendar', function (req, res) {
    let events = {};

    getLoginPage("kraj011", "Davidk123456");

    res.status(200).render('pages/calendar', {
        data: {
            events: events,
            imports: `
            <script src="/js/calendar.js"></script>
            <link rel="stylesheet" type="text/css" media="screen" href="/css/calendar.css">`
        }
    })
})

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

app.get('/policy', function (req, res) {
    res.send(policy);
});

app.get('/classroomData', function (req, res) {
    res.redirect(url);
});

app.get('/classroomCallback', async function (req, res, next) {
    let code = req.query.code; // this is the code
    console.log(code);

    let token = await getAccessToken(code);

    listCourses();

    next();
}, function (req, res) {
    res.redirect('/home');
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

app.post('/getClassroomAssignments', function (req, res) {

    res.send(null);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));