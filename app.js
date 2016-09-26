var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true }))


const index = require('./routes/index');

app.use('/', index);

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
