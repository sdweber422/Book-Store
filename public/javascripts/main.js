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
})
