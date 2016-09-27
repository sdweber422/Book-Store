const express = require('express');
const router = express.Router();
const database = require('../database')

router.get('/', (request, response, next) => {
  let page = (parseInt(request.query.page))
  if (isNaN(page)) page = 1;
  database.getAllBooks(page)
    .then( books => {
      response.render('home', {
        page: page,
        books: books.length === 11 ? books.slice(0,-1) : books,
        lastPageFlag: books[10] ? false : true
      })
      console.log('books', books)
      console.log('books.author', books.authors)
    }).catch(function(error){
      throw error
    })
})

module.exports = router;
