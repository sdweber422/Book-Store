DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  imageurl VARCHAR(255),
  description VARCHAR(1000),
  purchaseLink VARCHAR(255)
);

DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_authors;
CREATE TABLE book_authors (
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE book_genres (
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);
