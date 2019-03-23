var requests = require('request');
var fs = require('fs');

const cheerio = require('cheerio');


const getHeaders = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Host': 'mybackpack.gulliverschools.org',
    'Referer': 'https://mybackpack.gulliverschools.org/',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

const postHeaders = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'mybackpack.gulliverschools.org',
    'Origin': 'https://mybackpack.gulliverschools.org',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

function getLogin(user, pass, res) {
    var jar = requests.jar();
    var request = requests.defaults({
        jar: jar
    });
    request.post("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
        headers: getHeaders
    }, function (err, response, body) {
        login(user, pass, res, request)
    })

}

function login(user, pass, res, request) {

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
        pullGrades(res, request)
    })
}

function pullGrades(res, request) {
    request.get("https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces?selectedMenuId=true", {
        headers: getHeaders
    }, function (err, response, body) {
        parseGrades(body, res, request)
    })
}

function parseGrades(gradeString, res, request) {
    const classes = [];
    const $ = cheerio.load(gradeString);
    let richPanel = $('.rich-panel ').toArray();
    let tableChildren = $('span[id="f:inside:UpcomingTab:panelGridAssignStu"]:nth-of-type(1) > table[class="fullWidth"] > tbody').children().toArray();

    // iterate each class
    richPanel.forEach(element => {
        let classInfo = $(element).find('table > tbody > tr > td > table > tbody > tr');

        let className = $(classInfo).find('.dailyGradeCourseNameColumn').text();
        let classGrade = $(classInfo).find('.dailyGradeGroupColumn').text();
        let classTeacher = $(classInfo).find('.cellVAlignTop')[2]; // there's many divs called "cellVAlignTop" but teacher is always the third

        classTeacher = $(classTeacher).text();
        classes.push({
            "name": className,
            "grade": classGrade,
            "teacher": classTeacher
        });
    });

    console.log('JSON object of classes', classes);
    res.statusCode = 200;
    res.send(classes);

}


// const express = require('express')
// const app = express()
// app.use(express.json())
// const port = process.env.PORT || 3000; // this is just for heroku support


// app.post('/getGrades', function (req, res) {
//     let json = req.body;
//     if (!json.username || !json.password) {
//         res.statusCode = 400
//         res.send("wrong format!")

//         return
//     } else {
//         console.log("right!")
//         getLogin(json.username, json.password, res);
//     }
// })

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))