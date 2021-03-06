const express = require("express");
const router = express.Router();
const database = require('../database')

router.get("/", (request, response, next) => {
  const { options } = request.query
  let page = parseInt( request.query.page || 1 )

  if( options === undefined ) {
    response.render( 'search', { books: [], page, options })
  } else {
    database.searchBooks( options, page )
      .then( books => { response.render("search", {
        books: books.length === 11 ? books.slice(0,-1) : books,
        page,
        options,
        lastPageFlag: books[10] ? false : true
      }) })
      .catch( error => { response.send({ message: error.message }) })
  }
});

module.exports = router;
