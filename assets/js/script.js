
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

console.log("Start of JS");
let eventCount = 20;
let searchBtn = document.getElementById("search-btn");
let searchText = document.getElementById("search-city");
let dataRefreshBtn = document.getElementById("data-refresh-btn");


//initial pull of data points from EONET
dataPull();

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

var map = L.map('map').setView([39.85, -104.67], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// L.marker([39.83, -104.68])
//         .addTo(map)
//         .bindPopup("TEST-MARKER");

// L.marker([39.85, -104.69])
//         .addTo(map)
//         .bindPopup("TEST-MARKER");

// var latlngs = [
//          [39.84, -104.68],
//          [39.85, -104.69],
//          [39.83, -104.69]
//       ];
// L.polygon(latlngs, {color: 'orange', weight: 1})
// .addTo(map);

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

function dataPull(){
   //query eonet API
   let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?limit=${eventCount}&status=open`;
   fetch(queryEONET)
   .then(response => response.json())
      .then(data => {
         let eventData = data.events;
         console.log(eventData);//DELETE LATER
         console.log(`eventdata length is ${eventData.length}`);//DELETE LATER
   //add markers to map based on eventData length
         for (let index = 0; index < eventData.length; index++) {
            var date = new Date(data.events[index].geometry[0].date);
            L.marker([data.events[index].geometry[0].coordinates[1], data.events[index].geometry[0].coordinates[0]])
            .addTo(map)
            .bindPopup(`${data.events[index].title} -\n Date/Time: ${date.toString()}`); //marker description with date
         }   
      });
   console.log("API call complete");//DELETE later
};

function getCityCoord(){
   console.log(`getting city coordinates from ${searchText.value}`);//Test code
   //psuedo code: get coordinates from user input with API.
   searchText.value = "";
};

function dataRefresh(){
   console.log("getting and setting new variable options then calling dataPull");
   //clear all existing point
   // dataPull();
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
});

searchBtn.addEventListener("click", getCityCoord);
dataRefreshBtn.addEventListener("click", dataRefresh);
//Open Options Menu
$('#menu-open-btn').on('click', menuToggleHide);

//Close Options Menu
$('#menu-close-btn').on('click', menuToggleHide);



//options menu
function menuToggleHide() {
   var optionsMenu = $('#option-menu');
   if (optionsMenu.css('display') === 'none') {
      optionsMenu.css('display', 'block');
   } else {
      optionsMenu.css('display', 'none')
   }
};




//    if (x.style.display === "none") {
//      x.style.display = "block";
//    } else {
//      x.style.display = "none";
//    }
//  }