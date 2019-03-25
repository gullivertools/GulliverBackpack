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
    let grades = await getFullGrades(req.cookies['user-info']);
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
    res.cookie("user-info", {
        "username": json.username,
        "password": json.password
    }); // adds cookie
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

function getLoginBeforeCheck(user, pass, res) {
    var jar = requests.jar();
    var request = requests.defaults({
        jar: jar
    });
    request.get("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
        headers: getHeaders
    }, function (err, response, body) {
        checkLogin(user, pass, res, request)
    })

}

function checkLogin(user, pass, res, request) {
    const formData = {
        'AJAXREQUEST': '_viewRoot',
        'form': 'form',
        'javax.faces.ViewState': 'j_id1',
        'form:userId': user,
        'form:userPassword': pass,
        'form:signIn': 'form:signIn',
        'AJAX:EVENTS_COUNT': '1'
    }
    request.post("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
        headers: postHeaders,
        formData: formData
    }, function (err, response, body) {
        if (body.toLowerCase().includes("not found")) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({
                "success": "false"
            }))
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify({
                "success": "true"
            }))
        }
    })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));