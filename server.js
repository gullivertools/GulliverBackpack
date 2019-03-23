const express = require('express');
const port = process.env.PORT || 3000; // this is just for heroku support

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views')

app.use(express.static('public'));

app.get('/', function(req, res) {
    // res.send('Hello World');
    res.status(200).render('pages/home');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));