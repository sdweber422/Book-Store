const router = require('express').Router()
const database = require('../database')

router.get('/', (request, response) => {
  const { options } = request.query
  let page = parseInt( request.query.page || 1 )

  if( options === undefined ) {
    response.render( 'admin', { books: [], page, options, adminFlag: true })
  } else {
    database.searchBooks( options, page )
      .then( books => { response.render("admin", {
        books: books.length === 11 ? books.slice(0,-1) : books,
        page,
        options,
        adminFlag: true,
        lastPageFlag: books[10] ? false : true
      }) })
      .catch( error => { response.send({ message: error.message }) })
    }
})

router.get('/add', (request, response) => {
  response.render('add', {adminFlag: true})
})

router.get('/edit', (request, response) => {
  response.redirect('/admin')
})

router.get('/edit/:id', (request, response) => {
  const bookId = request.params.id

  Promise.all([
    database.getBookById(bookId),
    database.getAuthorsByBookId(bookId),
    database.getGenresByBookId(bookId)
  ])
  .then( results => {
    const book = results[0],
        authors = results[1],
        genres = results[2]
    response.render('edit', {
      book,
      authors,
      genres,
      adminFlag: true
    })
  })
})

router.post('/edit/:id', (request, response) => {
  const bookId = parseInt(request.params.id)

  database.updateBook(request.body, bookId)
    .then( book => {
      response.redirect(`/${bookId}`)
    })
    .catch( error => { response.send({ message: error.message }) })
})

router.get('/delete', (request, response) => {
  response.redirect('/admin')
})

router.get('/delete/:id', (request, response) => {
  const bookId = request.params.id
  database.getBookById(bookId)
  .then( book => {
    database.deleteBookById(bookId)
    .then( () => {
      response.render('delete', {book, adminFlag: true})
    })
  })
})

//add book
router.post('/', (request, response) => {
  database.addBook(request.body)
  .then( bookId => {
    response.redirect(`/${bookId}`)
  })
})

router.delete( '/author', (request, response) => {
  const { bookId, authorId } = request.body
  database.deleteAuthorAssociationByBookId(bookId, authorId)

  response.send({ success: true })
})

router.delete( '/genre', (request, response) => {
  const { bookId, genreId } = request.body
  database.deleteGenreAssociationByBookId(bookId, genreId)

  response.send({ success: true })
})

module.exports = router
