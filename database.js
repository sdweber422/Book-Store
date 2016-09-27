const databaseName = 'booksLibrary'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);

const getAllBooks = page => {
  let offset = (page - 1) * 10
  return db.any('SELECT * FROM books LIMIT 11 OFFSET $1', [offset])
    // .then()
}

const getBookById = bookId => {
  return db.one("SELECT * FROM books WHERE id = $1", [bookId])
}

const getAuthorByBookId = bookId => {
  let authorId = db.one("SELECT * FROM book_authors WHERE book_id = $1", [bookId])
  console.log("authorId: "+ authorId)
  return db.one("SELECT * FROM authors WHERE id = $1", [authorId])
}

module.exports = {
  getAllBooks,
  getBookById,
  getAuthorByBookId
}
