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
  if (bookIds.length === 0) return Promise.resolve(books)
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

const getBookById = bookId => {
  return db.one("SELECT * FROM books WHERE id = $1", [bookId])
}

const getAuthorsByBookId = bookId => {
  return db.any(`SELECT authors.name
          FROM
          authors JOIN book_authors
          ON authors.id = book_authors.author_id
          WHERE book_authors.book_id = $1`, [bookId])
}

const getGenresByBookId = bookId => {
  return db.any(`SELECT genres.name
          FROM
          genres JOIN book_genres
          ON genres.id = book_genres.genre_id
          WHERE book_genres.book_id = $1`, [bookId])
}

const deleteBookById = bookId => {
  return db.none(`DELETE FROM books WHERE id = $1;
    DELETE FROM book_authors WHERE book_id = $1;
    DELETE FROM book_genres WHERE book_id = $1`, [bookId])
}

const addBook = book => {
  return Promise.all([
    db.one(`INSERT INTO books (title, image_url, description)
             VALUES ($1, $2, $3)
             RETURNING *`,
             [book.title, book.image_url, book.description]),
    db.one(`INSERT INTO authors (name)
            VALUES ($1)
            RETURNING *`, [book.author]),
    db.one(`INSERT INTO genres (name)
            VALUES ($1)
            RETURNING *`, [book.genre])
  ]).then( results => {
    const bookId = results[0].id
    const authorId = results[1].id
    const genreId = results[2].id
    return Promise.all([
      db.none(`INSERT INTO book_authors (book_id, author_id)
               VALUES ($1, $2)`, [bookId, authorId]),
      db.none(`INSERT INTO book_genres (book_id, genre_id)
               VALUES ($1, $2)`, [bookId, genreId])
    ]).then( () => bookId )
  })
}

const updateBook = book => {
  return Promise.all([
    db.one(`UPDATE books
            SET title = $1,
            image_url = $2,
            description = $3
            WHERE id = $4`,
      [book.title, book.image_url, book.description, book.id]),
    db.one(`UPDATE authors
            SET name = $1
            WHERE `)
  ])
}


const getAuthorIdsByBookId = bookId => {
  return db.
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
  getAllBooks,
  getBookById,
  getAuthorsByBookId,
  getGenresByBookId,
  searchBooks,
  deleteBookById,
  addBook
}
