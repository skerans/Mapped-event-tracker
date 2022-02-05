
//load leaflet API
//Modal Prompt
//set buttons and items to visible as applicable for iinitial functionality

//set default date range to 7 days

//check for recent location in local storage, if not set default location to Denver


//??EONET search filtering? Do we have to pull data into arrays then have ready for user selections, or can we API pull based on filter criteria??//

//set background to leaflett map

//search bar with clickable search button

//hamburger menu
   //two date pickers
      //datepicker FROM
      //datepicker TO
   //checkboxes for Event Types
      //API call to determine different event types available then dynamically create checkboxes

//help and about div “buttons” bottom right - clickable with modal popup?

//Invisible DIV created for errors, will be set visible when error is needed
   //div section left(small) is for error icon
   //div section middle is for error text
   //div section right(small)

//when a user searches location
   //convert to string
   //use API to convert city to coordinates
   //check if status returns OK - Error IF not.
   //Pass Coordinates to Leaflet - refresh screen with new location

//when user changes Date FROM
   //Error check to see if FROM is earlier than TO
   //Get new data based on new date range and map scope - REFRESH
//when user changes Date TO
   //Error check to see if TO is earlier than FROM
   //Get new data based on new date range  and map scope - REFRESH 

//when user selects a checkbox option
   //Get new data based on current date range and map scope - REFRESH

//when item is on map
   //item hover shows the summary of event

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
