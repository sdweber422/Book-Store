var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true }))

app.get('/', (request, response, next) => {
  response.render('home')

})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
