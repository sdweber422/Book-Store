const router = require('express').Router()

router.get('/', (request, response) => {
  response.render('admin')
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
