const databaseName = 'booksLibrary'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);

const getAllBooks = page => {
  let offset = (page - 1) * 10
  return db.any('SELECT * FROM books LIMIT 11 OFFSET $1', [offset])
    .then(getAuthorsAndGenresForBookIds)
}

const getAuthorsForBookIds = bookIds => {
  const sql = `
    SELECT authors.*, book_authors.book_id
    FROM authors
    JOIN book_authors
    ON book_authors.author_id = authors.id
    WHERE book_authors.book_id IN ($1:csv)
  `
  return db.any(sql, [bookIds])
}

const getGenresForBookIds = bookIds => {
  const sql = `
    SELECT genres.*, book_genres.book_id
    FROM genres
    JOIN book_genres
    ON book_genres.genre_id = genres.id
    WHERE book_genres.genre_id IN ($1:csv)
  `
  return db.any(sql, [bookIds])
}

const getAuthorsAndGenresForBookIds = books => {
  const bookIds = books.map( book => book.id)
  if (bookIds === 0) return Promise.resolve(books)
  return Promise.all([
    getAuthorsForBookIds(bookIds),
    getGenresForBookIds(bookIds)
  ])
    .then( results => {
      const authors = results[0]
      const genres = results[1]
      books.forEach( book => {
        book.authors = authors.filter( author => author.book_id === book.id)
        book.genres = genres.filter( genre => genre.book_id === book.id)
      })
      return books
    })
}

const searchBooks = (options, page) => {
  let offset = (page - 1) * 10

  const sql = `
    SELECT DISTINCT
      books.*
    FROM
      books
    LEFT JOIN
      book_authors
    ON
      book_authors.book_id = books.id
    LEFT JOIN
      authors
    ON
      book_authors.author_id = authors.id
    LEFT JOIN 
      book_genres
    ON 
      book_genres.book_id = books.id
    LEFT JOIN 
      genres
    ON 
      book_genres.genre_id = genres.id
    WHERE
      LOWER(title) LIKE $1
    OR
      LOWER(description) LIKE $1
    OR
      LOWER(genres.name) LIKE $1
    OR 
      LOWER(authors.name) LIKE $1
    LIMIT 
      10
    OFFSET
      $2
  `
  const variables = [ '%'+options.replace(/\s+/,'%').toLowerCase()+'%', offset ]

  return db.manyOrNone(sql, variables)
    .then(getAuthorsAndGenresForBookIds)
}

module.exports = {
  getAllBooks: getAllBooks,
  searchBooks: searchBooks
}
