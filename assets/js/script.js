console.log("hello world");


$( document ).ready(function() {
  $.getJSON( "https://eonet.sci.gsfc.nasa.gov/api/v3/events", {
      status: "open",
      limit: 20
  })
  .done(function( data ) {
      $.each( data.events, function( key, event ) {
          $( "#eventList" ).append(
              "<dt>" + event.id + ": " + event.title + "</dt>"
          );
          if (event.description != null &&event.description.length) {
              $( "#eventList" ).append(
                  "<dd><em>" + event.description + "</em></dd>"
              );
          }
      });
  });
}); 