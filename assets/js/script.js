
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





// $( document ).ready(function() {
//   $.getJSON( "https://eonet.sci.gsfc.nasa.gov/api/v3/events", {
//       status: "open",
//       limit: 20
//   })
//   .done(function( data ) {
//       $.each( data.events, function( key, event ) {
//           $( "#eventList" ).append(
//               "<dt>" + event.id + ": " + event.title + "</dt>"
//           );
//           if (event.description != null &&event.description.length) {
//               $( "#eventList" ).append(
//                   "<dd><em>" + event.description + "</em></dd>"
//               );
//           }
//       });
//   });
// }); 

//hamburer button
let optionMenu = document.getElementById("option-menu");

function openMenu() {
   if (optionMenu.style.display === "block") {
      optionMenu.style.display = "none";
   } else {
      optionMenu.style.display = "block";
   }
}




var map = L.map('map').setView([39.85, -104.67], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


L.marker([39.83, -104.68])
        .addTo(map)
        .bindPopup("TEST-MARKER");

L.marker([39.85, -104.69])
        .addTo(map)
        .bindPopup("TEST-MARKER");

var latlngs = [
         [39.84, -104.68],
         [39.85, -104.69],
         [39.83, -104.69]
      ];
L.polygon(latlngs, {color: 'orange', weight: 1})
.addTo(map);

// map.addLayer()

// //control layers

// var optionsOverlay = L.mapOverlay()

// var popup = L.popup()
//     .setContent("I am a standalone popup.");



function closeModal() {
   $('.modal').addClass('hidden');
   $('header, #map, main.overlay').removeClass('blur');
}

function openModal(evt) {
   $('.modal').removeClass('hidden');
   $('header, #map, main.overlay').addClass('blur');

   let selectedModal = evt.target.getAttribute('data-modal');
   
   $('.modal-header h2').text(selectedModal);
   };


////// EVENT HANDLERS //////

//Open Modal
$('.modal-btn').on('click', function (evt) {
   openModal(evt);
});

// Close Modal
$('#modal-close-btn').on('click', closeModal);
$('.modal-background').on('click', closeModal);

// Prevents clicking through the modal container and onto to back to close it
$('.modal-container').on('click', function (evt) {
   evt.stopPropagation();
})


//Date
document.getElementById("mytext").value = "My value";

//search bar
// let searchBtn = document.getElementById("#search-btn");
// let search = document.getElementById("#search");

// function switchDisplay() {
// if(search.textContent !== null) {
//    searchBtn.style.display = "block"
// } else {
//    searchBtn.style.display = "none"
// }
// }