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



var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);
