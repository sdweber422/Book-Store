const router = require('express').Router()
const database = require('../database')

router.get('/', (request, response) => {
  const { options } = request.query
  let page = parseInt( request.query.page || 1 )

  if( options === undefined ) {
    response.render( 'admin', { books: [], page, options, adminFlag: true })
  } else {
    database.searchBooks( options, page )
      .then( books => { response.render("admin", {books, page, options, adminFlag: true }) })
      .catch( error => { response.send({ message: error.message }) })
    }
})

router.get('/add', (request, response) => {
  response.render('add')
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
    let book = results[0],
        authors = results[1],
        genres = []
    for(ele of results[2]) {
      if (!genres.includes(ele.name)) {
        genres.push(ele.name)
      }
    }
    response.render('edit', {
      book,
      authors,
      genres
    })
  })
})

router.post('/edit/:id', (request, response) => {
  request.body
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
      response.render('delete', {book})
    })
  })
})

//add
router.post('/', (request, response) => {
  database.addBook(request.body)
  .then( bookId => {
    console.log(bookId)
    response.redirect(`/${bookId}`)
  })
})

// //delete
// router.post('/:id', (request, response) => {
//   const bookId = request.params.id
// })

module.exports = router
