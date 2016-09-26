const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
  response.redirect('/')
})

router.get('/:id', (request, response, next) => {
  response.render('details')
})

module.exports = router;
