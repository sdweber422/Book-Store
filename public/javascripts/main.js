$(document).ready( function() {
  $('.addAuthorButton').click( function (event) {
    event.preventDefault()
    $(".author").append("<div class='authorInput'><input placeholder='New Author' type='text' name='authors'></input></div>")
  } )

  $('.addGenreButton').click( function (event) {
    event.preventDefault()
    $(".genre").append("<div class='genreInput'><input placeholder= 'New Genre' type= 'text' name='genres'></input></div>")
  } )

  $( '.delete-author' ).click( function( event ) {
    event.preventDefault()

    var data = $(this).data()

    $.ajax({
      url: '/admin/author',
      method: 'delete',
      data: data,
      success: function( result ) {
        $('.edit-author[data-author-id=' + data.authorId + ']' ).remove()
      }
    })
  })

  $( '.delete-genre' ).click( function( event ) {
    event.preventDefault()

    var data = $(this).data()

    $.ajax({
      url: '/admin/genre',
      method: 'delete',
      data: data,
      success: function( result ) {
        $('.edit-genre[data-genre-id=' + data.genreId + ']' ).remove()
      }
    })
  })
})
