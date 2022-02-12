
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

///// GLOBAL VARIABLES /////
let eventCount = 20;
let searchBtn = document.getElementById("search-btn");
let searchText = document.getElementById("search-city");
let dataRefreshBtn = $("#data-refresh-btn");
const dateFrom = document.getElementById("from");
const dateTo = document.getElementById("to");

//map variables
let layerGroup;
let map;
let minLong;
let maxLong;
let minLat;
let maxLat;
let bounds;

let storedLat;
let storedLon;

//Date Variables 
let dateStart = new Date();
let dateEnd = new Date();

// let eventTypeArr = ['wildfires'];

///// FUNCTIONS /////

// This function gets the boundaries of the current map view
function getNewBoundaries() {
   // Storing the map boundaries in a variable
   bounds = map.getBounds();

   // setting the Lat/Long variables with the current boundaries of the four sides of the map
   minLong = bounds.getWest();
   maxLong = bounds.getEast();
   minLat = bounds.getSouth();
   maxLat = bounds.getNorth();
}


// Checkbox UI Management

// Variables
checkboxAll = $('#checkbox-all');
singleEventTypeCheckbox = $('.single-event-type');


// Event Handlers
checkboxAll.on('change', function () {
   if (!$(this).is(':checked')) {
      console.log('Unchecking all event types');
      singleEventTypeCheckbox.each( function () {
         console.log('checking other checkboxes')
         if ($(this).prop('checked', true)) {
            $(this).prop('checked', false);
         }
      })
   } else {
      console.log('Now Im checked!')
      singleEventTypeCheckbox.each( function () {
         $(this).prop('checked', true);
      })
   }
})

singleEventTypeCheckbox.on('change', function () {
   if ($('.single-event-type:checked').length == singleEventTypeCheckbox.length) {
      checkboxAll.prop('checked', true);
   }

   if (!$(this).is(':checked')) {
      console.log('unchecking this type')
      checkboxAll.prop('checked', false);
   }
})


// This function fetches event data from the EONET API and uses it to populate the event markers on the map
function dataPull() {
   //query eonet API

   // NM checkbox functionality
   // Looking at the checkboxes and if all or one is checked, push that event type to eventTypesArr which then is passed to the API call
   let eventTypesArr = [];
   console.log(eventTypesArr);
   if (checkboxAll.is(':checked')) {
      console.log('all event types checked');
      eventTypesArr = [];
   } else {
      singleEventTypeCheckbox.each( function() {
         if ($(this).is(':checked')) {
            console.log($(this).attr('data-event-type') + ' is checked');
            eventTypesArr.push($(this).attr('data-event-type'));
         };
       });
   }

   console.log(eventTypesArr);
   if (dateEnd >= dateStart) {
   let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${minLong},${maxLat},${maxLong},${minLat}&start=${dateStart}&end=${dateEnd}&category=${eventTypesArr}&limit=${eventCount}&status=all`;
   fetch(queryEONET)
      .then(response => response.json())
      .then(data => {
         console.log(`data.events is: ${data.events}`);
         var pointList = [];
         var polygonPoints = [];
         let eventData = data.events;
         console.log(eventData);//DELETE LATER
         console.log(`eventdata length is ${eventData.length}`);//DELETE LATER
         //add markers to map based on eventData length
         for (let index = 0; index < eventData.length; index++) {
            var date = new Date(data.events[index].geometry[0].date);
            var eventMarker = L.marker([data.events[index].geometry[0].coordinates[1], data.events[index].geometry[0].coordinates[0]]);
            eventMarker.addTo(layerGroup)
               .bindPopup(`${data.events[index].title} -\n Date/Time: ${date.toString()}`); //marker description with date
         }
      });
   console.log("API call complete");//DELETE later
   }
};


// Getting the city coordinates based on user entry in the city search bar
function getCityCoord(event) {
   event.preventDefault();

   let newCity = searchText.value;

   console.log(`getting city coordinates from ${searchText.value}`); //Test code
   //psuedo code: get coordinates from user input with API.

   if (newCity) {

      const myApiKey = "b9d312a1f35b1b477f63e4d5e699509c";

      const weatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${newCity}&limit=1&appid=${myApiKey}`;

      fetch(weatherUrl)
         .then(function (response) {
            if (response.ok) {
               response.json().then(function (data) {
                  console.log(data);
                  if (data.length > 0) {  // checks if the city found 
                     const checkCity = data[0].name;
                     console.log(checkCity);
                     const nameArray = newCity.split('');
                     nameArray[0] = nameArray[0].toUpperCase();
                     newCity = nameArray.join('');
                     if (checkCity.toLowerCase() == newCity.toLowerCase()) {  // checks (found city === entered city)
                        console.log(data);
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        console.log(lat);
                        console.log(lon);
                        L.marker([data[0].lat, data[0].lon])
                           .addTo(layerGroup)
                           .bindPopup(`${checkCity} - ${newCity}`); // add marker
                        map.setView([lat, lon], 10) //set map to location, zoom to 10
                        console.log(bounds.getCenter());
                        localStorage.setItem("Lat", lat);
                        localStorage.setItem("Lon", lon);
                     }
                  } else {
                     alert("The city is not found!");
                  }
               });
            }
         });
   }
};

// Data Refresh Function
function dataRefresh() {
   console.log("getting and setting new variable options then calling dataPull");

   //clear all existing point
   layerGroup.clearLayers();

   // Pull new data
   dataPull();
};


// Function for toggling visibility of the options menu
function menuToggleHide() {
   var optionsMenu = $('#option-menu');
   if (optionsMenu.css('display') === 'none') {
      optionsMenu.css('display', 'block');
   } else {
      optionsMenu.css('display', 'none')
   }
};


// Function to open the modals
function openModal(evt) {
   $('.modal').removeClass('hidden');
   $('header, #map, main.overlay').addClass('blur');

   let selectedModal = evt.target.getAttribute('data-modal');

   $('.modal-header h2').text(selectedModal);
};

// Function to close the currently opened modal
function closeModal() {
   $('.modal').addClass('hidden');
   $('header, #map, main.overlay').removeClass('blur');
}


//function to get lat/lon from local storage
function getStoredLocation() {
   storedLat = localStorage.getItem("Lat");
   storedLon = localStorage.getItem("Lon");

   if (localStorage.getItem('Lat') === null) {
      localStorage.setItem('Lat', 39.85);
   }
   if (localStorage.getItem('Lon') === null) {
      localStorage.setItem('Lon', -104.67);
   }
}

///// Creating the map /////
function createMap() {
   
map = L.map('map').setView([storedLat, storedLon], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
layerGroup = L.layerGroup().addTo(map);
bounds = map.getBounds();

minLong = bounds.getWest();
maxLong = bounds.getEast();
minLat = bounds.getSouth();
maxLat = bounds.getNorth();
}

//initial pull of data points from EONET
function init() {
   getStoredLocation();
   createMap();
   dataPull();
}

// setting default date range to 30 days and future date would not be allowed
function setDatePicker() {
   //get today's date 
   let today = new Date();
   let dd = String(today.getDate()).padStart(2, '0');
   let mm = String(today.getMonth() + 1).padStart(2, '0');
   let yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;  
   //get today's date minus 30 days 
   let todayMinus = new Date();
   todayMinus.setDate(todayMinus.getDate() - 90); // today minus 30 days
   dd = String(todayMinus.getDate()).padStart(2, '0');
   mm = String(todayMinus.getMonth() + 1).padStart(2, '0');
   yyyy = todayMinus.getFullYear();
   todayMinus = yyyy + '-' + mm + '-' + dd;
   // set default date
   dateStart = todayMinus;
   dateEnd = today;
   dateFrom.value = todayMinus;
   dateTo.value = today;
   // future date restriction
   dateFrom.setAttribute("max", today);
   dateTo.setAttribute("max", today);
   console.log(`date Start is: ${dateStart}`);
   console.log(`date End is: ${dateEnd}`);
};


getStoredLocation();
setDatePicker();
init();



////// EVENT HANDLERS //////


// Map move event -- triggers new boundaries
map.on('moveend', function () {
   dataRefreshBtn.attr('disabled', false);
   getNewBoundaries();
});

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

// Search City Event
$("#search-bar").on("submit", function (event) {
   getCityCoord(event);
   $("#search-city").val("");
});

// Refresh Data Event
dataRefreshBtn.on("click", function () {
   dataRefreshBtn.attr('disabled', true);
   dataRefresh();
   // let mapCenter = map.getCenter()
   // console.log(mapCenter);
});

//Open Options Menu
$('#menu-open-btn').on('click', menuToggleHide);

//Close Options Menu
$('#menu-close-btn').on('click', menuToggleHide);







