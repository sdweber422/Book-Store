const express = require('express');
const router = express.Router();
const database = require('../database')

router.get('/', (request, response, next) => {
  console.log('pageUNParse', request.query.page)
  let page = (parseInt(request.query.page))
  console.log('page', page)
  if (isNaN(page)) page = 1;
  console.log('pageParse', page)
  database.getAllBooks(page)
    .then( books => { 
      response.render('home', {
        page,
        books   
      }) 
    }).catch(function(error){
      throw error
    })
})

module.exports = router;