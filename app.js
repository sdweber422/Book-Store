var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true }))


const index = require('./routes/index')
const search = require("./routes/search")
const admin = require('./routes/admin')
const details = require('./routes/details')

app.use('/', index)
app.use("/search", search)
app.use('/admin', admin)
app.use('/details', details)

app.listen(3000, function () {
  console.log('Listening on port 3000')
})
