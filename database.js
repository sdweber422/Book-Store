const databaseName = 'booksLibrary'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);

const getAllBooks = (page=1) => {
  let offset = (page - 1) * 10
  return db.any('SELECT * FROM books LIMIT 10 OFFSET $1', [offset])
    // .then()
}

module.exports = {
  getAllBooks: getAllBooks
}