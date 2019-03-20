var requests = require('request');
var fs = require('fs');
var request = requests.defaults({
    jar: true
});
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

function getLogin() {
    request.post("https://mybackpack.gulliverschools.org/SeniorApps/facelets/registration/loginCenter.xhtml", {
        headers: getHeaders
    }, function (err, res, body) {
        // login()
        return body
    })

}

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send("hey!"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))