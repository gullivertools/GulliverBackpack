const requests = require('request');
const cheerio = require('cheerio');

const postHeaders = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'mybackpack.gulliverschools.org',
    'Origin': 'https://mybackpack.gulliverschools.org',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

const jar = requests.jar();
const request = requests.defaults({
    jar: jar
});

function loginToMBP(username, password) {

    return new Promise(resolve => {
        request.get("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Host': 'mybackpack.gulliverschools.org',
                'Referer': 'https://mybackpack.gulliverschools.org/',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
            }
        }, function (err, response, body) {
            // actually login
            request.post("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Host': 'mybackpack.gulliverschools.org',
                    'Origin': 'https://mybackpack.gulliverschools.org',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
                },
                formData: {
                    'AJAXREQUEST': '_viewRoot',
                    'form': 'form',
                    'javax.faces.ViewState': 'j_id1',
                    'form:userId': username,
                    'form:userPassword': password,
                    'form:signIn': 'form:signIn',
                    'AJAX:EVENTS_COUNT': '1'
                }
            }, function (err, response, body) {
                resolve();
            })
        });
    }).catch(e => {
        if (e) throw e;
    })
}

function fetchGrades(username, password) {
    return new Promise(resolve => {
        request.get("https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces?selectedMenuId=true", {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Host': 'mybackpack.gulliverschools.org',
                'Referer': 'https://mybackpack.gulliverschools.org/',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
            }
        }, function (err, response, body) {
            resolve(body)
        });
    });
}

async function getGrades(userCookie) {
    let username = userCookie.username;
    let password = userCookie.password;
    const classes = [];

    await loginToMBP(username, password);

    let grades = await fetchGrades(username, password);
    const $ = cheerio.load(grades);
    let richPanel = $('.rich-panel ').toArray();

    
    richPanel.forEach(element => {
        let classInfo = $(element).find('table > tbody > tr > td > table > tbody > tr');

        let className = $(classInfo).find('.dailyGradeCourseNameColumn').text().replace(/\(([^\)]+)\)/, ""); // gets rid of the (S1, S2) bs
        let classGrade = $(classInfo).find('.dailyGradeGroupColumn').text().replace("Grade to Date: ", "");
        let classTeacher = $(classInfo).find('.cellVAlignTop')[2]; // there's many divs called "cellVAlignTop" but teacher is always the third

        classTeacher = $(classTeacher).text().replace("Teacher: ", "");

        let letter = "N/A";
        let number = "";
        if(classGrade != " ") {
            letter = (classGrade.match(/[\w]|[\w\+]|[\w-]/) || ["N/A"])[0];
            number = classGrade.replace(/[A-z]|\+|-| /, "");
        }
        classes.push({
            "name": className,
            "gradeLetter": letter,
            "gradeNumber": number,
            "teacher": classTeacher
        });
    });

    return classes;
}

module.exports = {
    getGrades
}