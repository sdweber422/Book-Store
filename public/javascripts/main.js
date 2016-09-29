$(document).ready( function() {
  $( '.delete-author' ).click( function( event ) {
    event.preventDefault()

    var data = $(this).data()

    $.ajax({
      url: '/admin/author',
      method: 'delete',
      data: data,
      success: function( result ) {
        $('.edit-author[data-author-id=' + data.authorId + ']' ).remove()
        console.log( 'Author deleted!', result )
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
        console.log( 'Genre deleted!', result )
      }
    })
  })
})
