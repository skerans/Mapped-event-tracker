
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

map.addLayer()

//control layers

var optionsOverlay = L.mapOverlay()

var popup = L.popup()
    .setContent("I am a standalone popup.");



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