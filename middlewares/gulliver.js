var requests = require('request')

const cheerio = require('cheerio')
const getHeaders = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'www.gulliverschools.org',
    'Referer': 'https://www.gulliverschools.org/student-portal',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
}

function getLoginPage(username, password) {
    var request = requests.defaults({
        jar: true
    })

    request.get("https://www.gulliverschools.org/login", {
        headers: getHeaders
    }, function (err, res, body) {
        getCSRF(username, password, request);
    })
}

function getCSRF(username, password, request) {
    const csrfHeaders = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Host': 'www.gulliverschools.org',
        'Referer': 'https://www.gulliverschools.org/login',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    }

    request.get("https://www.gulliverschools.org/fs/sessions/user/csrf-token", {
        headers: csrfHeaders
    }, function (err, res, body) {
        const $ = cheerio.load(body);
        const token = $('input').val();
        login(token, username, password, request)
    })
}

function login(token, username, password, request) {
    const postHeaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'www.gulliverschools.org',
        'Origin': 'https://www.gulliverschools.org',
        'Referer': 'https://www.gulliverschools.org/login',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    }

    const postData = {
        'utf8': '✓',
        'username': username,
        'password': password,
        'protected_page': 'false',
        'authenticity_token': token
    }

    request.post("https://www.gulliverschools.org/fs/auth/finalsite/callback", {
        headers: postHeaders,
        formData: postData
    }, function (err, res, body) {
        if (res.headers['location'] != 'https://www.gulliverschools.org/student-portal')
            return
        fetchCalendar(request);
    })
}

function fetchCalendar(request) {
    request.get("https://www.gulliverschools.org/groups.cfm", {
        headers: getHeaders
    }, function (err, res, body) {
        parseCalendar(body)
    })
}

function parseCalendar(calendarString) {
    let assignments = [];
    const $ = cheerio.load(calendarString);
    const events = $('.caldata').find('ul').toArray();
    // console.log(events)
    events.forEach(event => {
        const eventName = $(event).find('.etitle').find('a').text().trim().replace('\n', '')
        const month = $(event).find('.event_stackmonname').text()
        const day = $(event).find('.event_stackdaynum').text()
        const weekDay = $(event).find('.event_stackdayname').text()
        if (eventName != '') {
            assignments.push({
                "name": eventName.replace("DUE: ", "").replace(/\(p \d\)/, "").replace("due", ""),
                "due": weekDay + ", " + month + " " + day
            })
        }
    })
    return assignments;
}


getLoginPage("kraj011", "Davidk123456");