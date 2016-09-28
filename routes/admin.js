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
  console.log(bookId)
  response.render('edit')
})

router.get('/delete', (request, response) => {
  response.redirect('/admin')
})

router.get('/delete/:id', (request, response) => {
  const bookId = request.params.id
  response.render('delete', {bookId})
})

//add
router.post('/', (request, response) => {
})

//delete
router.post('/:id', (request, response) => {
  const bookId = request.params.id
})

module.exports = router
