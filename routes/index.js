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
    }).catch(function(error){
      throw error
    })
})

router.get('/:id', (request, response, next) => {
  let bookId = parseInt(request.params.id)
  let author
  database.getAuthorByBookId(bookId)
  .then( authorRow => {
    author = authorRow.name
    console.log(author)
  })
  database.getBookById(bookId)
  .then( book => {
    response.render('details', {
      book,
      author
    })
  })
})

module.exports = router;
