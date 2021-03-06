const requests = require("request")
const cheerio = require("cheerio")
const https = require("https")

const postHeaders = {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Host: "mybackpack.gulliverschools.org",
    Origin: "https://mybackpack.gulliverschools.org",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
}

function loginToMBP(username, password, request) {
    var loginCookies = ""
    return new Promise(resolve => {
        request.get(
            "https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    Connection: "keep-alive",
                    Host: "mybackpack.gulliverschools.org",
                    Referer: "https://mybackpack.gulliverschools.org/",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
                }
            },
            function (err, response, body) {
                loginCookies = JSON.stringify(response.headers["set-cookie"]).replace('[', '').replace(']', '').replace('"', '')
                // actually login
                request.post(
                    "https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
                        headers: {
                            Accept: "*/*",
                            "Accept-Language": "en-US,en;q=0.9",
                            Connection: "keep-alive",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            Host: "mybackpack.gulliverschools.org",
                            Origin: "https://mybackpack.gulliverschools.org",
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
                        },
                        formData: {
                            AJAXREQUEST: "_viewRoot",
                            form: "form",
                            "javax.faces.ViewState": "j_id1",
                            "form:userId": username,
                            "form:userPassword": password,
                            "form:signIn": "form:signIn",
                            "AJAX:EVENTS_COUNT": "1",
                        }
                    },
                    function (err1, response1, body1) {
                        loginCookies += "; " + JSON.stringify(response1.headers["set-cookie"]).replace('[', '').replace(']', '').replace('"', '');
                        resolve(loginCookies)
                    }
                )
            }
        )
    }).catch(e => {
        if (e) throw e
    })
}

function fetchGrades(username, password, request) {
    return new Promise(resolve => {
        request.get(
            "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces?selectedMenuId=true", {
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    Connection: "keep-alive",
                    Host: "mybackpack.gulliverschools.org",
                    Referer: "https://mybackpack.gulliverschools.org/",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
                }
            },
            function (err, response, body) {
                resolve(body)
            }
        )
    })
}

async function getGrades(userCookie) {
    const jar = requests.jar()
    const request = requests.defaults({
        jar: jar,
    })

    let username = userCookie.username
    let password = userCookie.password
    const classes = []

    await loginToMBP(username, password, request)

    let grades = await fetchGrades(username, password, request)
    const $ = cheerio.load(grades)
    let richPanel = $(".rich-panel ").toArray()

    richPanel.forEach(element => {
        let classInfo = $(element).find(
            "table > tbody > tr > td > table > tbody > tr"
        )

        let className = $(classInfo)
            .find(".dailyGradeCourseNameColumn")
            .text()
            .replace(/\(([^\)]+)\)/, "") // gets rid of the (S1, S2) bs
        let classGrade = $(classInfo)
            .find(".dailyGradeGroupColumn")
            .text()
            .replace("Grade to Date: ", "")
        let classTeacher = $(classInfo).find(".cellVAlignTop")[2] // there's many divs called "cellVAlignTop" but teacher is always the third

        classTeacher = $(classTeacher)
            .text()
            .replace("Teacher: ", "")

        let letter = "N/A"
        let number = ""
        if (classGrade != " ") {
            letter = classGrade.substr(0, 2);
            number = classGrade.replace(/[A-z -]/g, ""); // this doesn't quite work yet
        }
        classes.push({
            name: className,
            gradeLetter: letter,
            gradeNumber: number,
            teacher: classTeacher,
        })
    })

    return classes
}

async function getFullGrades(userCookie, quarter) {
    let username = userCookie.username
    let password = userCookie.password
    const gradesList = []



    const request = requests.defaults({
        jar: true
    })

    let loginCookies = await loginToMBP(username, password, request);
    console.log(loginCookies)

    await fetchGrades(username, password, request)
    console.log(request.jar().getCookies('mybackpack.gulliverschools.org'));

    // let grades = await fetchFullGrades(request);
    const fetchGradesData = {
        "f": "f",
        "javax.faces.ViewState": "j_id3",
        "f:inside:UpcomingTab:AssignMPSel": "~~all~~",
        "f:inside:UpcomingTab:j_id_jsp_394614891_10pc6": "",
        "f:inside:UpcomingTab:j_id_jsp_394614891_12pc6": "",
        "f:_idcl": "f:inside j_id_jsp_1774471256_10pc5",
    }
    const fetchGradesHeaders = {
        Authorization: "",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": loginCookies,
        "Upgrade-Insecure-Requests": "1",
        Host: "mybackpack.gulliverschools.org",
        Origin: "https://mybackpack.gulliverschools.org",
        Referer: "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    }


    request.post(
        "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces?selectedMenuId=true", {
            headers: fetchGradesHeaders,
            form: fetchGradesData
        },
        function (err, response, body) {
            console.log(response.statusCode)
            console.log(response.body)
            console.log(response.headers)
            // console.log(response.headers)
        }
    )

    // const $ = cheerio.load(grades);
    // let richPanel = $('.rich-panel ').toArray();

    // richPanel.forEach(element => {
    //     console.log("runnin for each")
    //     let classInfo = $(element).find('table > tbody > tr > td > table > tbody');
    //     let gradesRow = $(classInfo).find('tr')[1];
    //     let gradesInfo = $(gradesRow).find('td > table > tbody');
    //     gradesList.push({
    //         "name": "new"
    //     });
    // gradesInfo.forEach(gradeRow => {

    //     let gradeNameRow = $(gradeRow).find('td > table > tbody > tr').find('td')[2];
    //     let gradeName = $(gradeNameRow).find('a')[0];
    //     console.log(gradeName.text());
    //     gradesList.push({
    //         "name": gradeName.text()
    //     })
    // })
    // let className = $(classInfo).find('.dailyGradeCourseNameColumn').text().replace(/\(([^\)]+)\)/, ""); // gets rid of the (S1, S2) bs
    // let classGrade = $(classInfo).find('.dailyGradeGroupColumn').text().replace("Grade to Date: ", "");
    // let classTeacher = $(classInfo).find('.cellVAlignTop')[2]; // there's many divs called "cellVAlignTop" but teacher is always the third

    // });

    return gradesList
}

function fetchFullGrades(request) {
    const fetchGradesData = {
        f: "f",
        "javax.faces.ViewState": "j_id3",
        "f:inside:UpcomingTab:AssignMPSel": "~~all~~",
        "f:inside:UpcomingTab:j_id_jsp_394614891_10pc6": "",
        "f:inside:UpcomingTab:j_id_jsp_394614891_12pc6": "",
        "f:_idcl": "f:inside j_id_jsp_1774471256_10pc5",
    }
    const fetchGradesHeaders = {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Upgrade-Insecure-Requests": "1",
        Host: "mybackpack.gulliverschools.org",
        Origin: "https://mybackpack.gulliverschools.org",
        Referer: "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    }
    return new Promise(resolve => {
        request.post(
            "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/academic/dailyAssignments/gradeBookGrades.faces", {
                headers: fetchGradesHeaders,
                formData: fetchGradesData,
                rejectUnauthorized: false,
            },
            function (err, response, body) {
                console.log(response.statusCode)
                console.log(body)
                resolve(body)
            }
        )
    })
}

function fetchSchedule(request) {
    const getHeaders = {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
    }
    return new Promise(resolve => {
        request.get(
            "https://mybackpack.gulliverschools.org/SeniorApps/studentParent/schedule.faces?selectedMenuId=true&convid=37141", {
                headers: getHeaders,
            },
            function (err, response, body) {
                console.log(response.statusCode)
                console.log(body)
                resolve(body)
            }
        )
    })
}

module.exports = {
    getGrades,
    getFullGrades,
}