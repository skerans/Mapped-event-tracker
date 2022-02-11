
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
let searchText = document.getElementById("search-city");
let dataRefreshBtn = $("#data-refresh-btn");

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

// This function fetches event data from the EONET API and uses it to populate the event markers on the map
function dataPull() {
   //query eonet API
   let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${minLong},${maxLat},${maxLong},${minLat}&limit=${eventCount}&status=all`;
   fetch(queryEONET)
      .then(response => response.json())
      .then(data => {
         if (data.events.length > 0) {
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
            displayMessage(eventData.length + " event(s) found!");
         } else {
            console.log("No event happened in this area!");
            displayMessage("No event happened in this area!");
         }
      });
   console.log("API call complete");//DELETE later
};


// Getting the city coordinates based on user entry in the city search bar
function getCityCoord() {
   //pseudo code: get coordinates from user input with API.
   let newCity = searchText.value;
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
                     if (checkCity.toLowerCase() == newCity.toLowerCase()) {  // checks (found city === entered city)
                        console.log(data);
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        L.marker([data[0].lat, data[0].lon])
                           .addTo(layerGroup)
                           .bindPopup(`${checkCity}`); // add marker
                        map.setView([lat, lon], 10)    //set map to location, zoom to 10
                        console.log(bounds.getCenter());
                        localStorage.setItem("Lat", lat);
                        localStorage.setItem("Lon", lon);
                        dataPull();
                     }
                  } else {
                     console.log("The city is not found! Check the name, please.");
                     displayMessage("The city is not found! Check the name, please.");
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

getStoredLocation()
init()

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
   event.preventDefault();
   getCityCoord();
   $("#search-city").val("");
});

// Refresh Data Event
dataRefreshBtn.on("click", function (event) {
   event.preventDefault();
   dataRefreshBtn.attr('disabled', true);
   dataRefresh();
});

const dateFrom = document.getElementById("from");
const dateTo = document.getElementById("to");
const allEvents = document.getElementById("checkbox-radio-option-all");
const wildfires = document.getElementById("checkbox-radio-option-one");
const severeStroms = document.getElementById("checkbox-radio-option-two");
const volcanoes = document.getElementById("checkbox-radio-option-three");
const seaLakeIce = document.getElementById("checkbox-radio-option-four");
const earthquakes = document.getElementById("checkbox-radio-option-five");
const errorHandle = document.getElementById("error-message");

function setFormElements() {
   let today = new Date();   // StackOverFlow
   const dd = String(today.getDate()).padStart(2, '0');
   const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
   const yyyy = today.getFullYear();
   today = yyyy + '-' + mm + '-' + dd;  // The date would not be future date
   dateFrom.setAttribute("max", today);
   dateTo.setAttribute("max", today);
}

function showFormResults() {
   let dateStart = dateFrom.value;
   let dateEnd = dateTo.value;

   //clear all existing points
   layerGroup.clearLayers();

   if (dateEnd >= dateStart) {
      let queryEONET = `https://eonet.gsfc.nasa.gov/api/v3/events?start=${dateStart}&end=${dateEnd}`;
      fetch(queryEONET)
         .then(response => response.json())
         .then(data => {
            console.log(data.events);
            if (data.events.length > 0) {
               let eventData = [];
               if (allEvents.checked) {
                  eventData = data.events;
                  console.log(eventData);
               } else {
                  let tempData = data.events;
                  if (wildfires.checked) {
                     for (let i = 0; i < tempData.length; i++) {
                        let eventName = tempData[i].categories[0].id;
                        if (eventName === "wildfires") {
                           eventData.push(tempData[i])
                        }
                     }
                     if (eventData.length === 0) {
                        console.log("No wildfire event happened!");
                        displayMessage("No wildfire event happened!");
                     }
                  }
                  if (severeStroms.checked) {
                     for (let i = 0; i < tempData.length; i++) {
                        let eventName = tempData[i].categories[0].id;
                        if (eventName === "severeStorms") {
                           eventData.push(tempData[i])
                        }
                     }
                     if (eventData.length === 0) {
                        console.log("No Severe Storm event happened!");
                        displayMessage("No Severe Storm event happened!");
                     }
                  }
                  if (volcanoes.checked) {
                     for (let i = 0; i < tempData.length; i++) {
                        let eventName = tempData[i].categories[0].id;
                        if (eventName === "volcanoes") {
                           eventData.push(tempData[i])
                        }
                     }
                     if (eventData.length === 0) {
                        console.log("No Volcanoe event happened!");
                        displayMessage("No Volcanoe event happened!");
                     }
                  }
                  if (seaLakeIce.checked) {
                     for (let i = 0; i < tempData.length; i++) {
                        let eventName = tempData[i].categories[0].id;
                        if (eventName === "seaLakeIce") {
                           eventData.push(tempData[i])
                        }
                     }
                     if (eventData.length === 0) {
                        console.log("No Iceberg event happened!");
                        displayMessage("No Iceberg event happened!");
                     }
                  }
                  if (earthquakes.checked) {
                     for (let i = 0; i < tempData.length; i++) {
                        let eventName = tempData[i].categories[0].id;
                        if (eventName === "earthquakes") {
                           eventData.push(tempData[i])
                        }
                     }
                     if (eventData.length === 0) {
                        console.log("No Earthquake event happened!");
                        displayMessage("No Earthquake event happened!");
                     }
                  }
                  console.log(eventData);
               }
               if (eventData.length > 0) {
                  for (let index = 0; index < eventData.length; index++) {
                     var date = new Date(eventData[index].geometry[0].date);
                     var eventMarker = L.marker([eventData[index].geometry[0].coordinates[1], eventData[index].geometry[0].coordinates[0]]);
                     eventMarker.addTo(layerGroup)
                        .bindPopup(`${eventData[index].title} -\n Date/Time: ${date.toString()}`); //marker description with date
                  }
                  displayMessage(eventData.length + " event(s) found!");
               } else {
                  console.log("No event found!");
                  displayMessage("No event found!");
               }
            } else {
               console.log("No event found!");
               displayMessage("No event found!");
            }
         });
   }
}

//Open Options Menu
$('#menu-open-btn').on('click', function (event) {
   event.preventDefault();
   setFormElements();
   menuToggleHide();
});

//Close Options Menu
$('#menu-close-btn').on('click', function (event) {
   event.preventDefault();
   menuToggleHide();
   showFormResults();
});

// Check event type checkbox 
$('#event-types').on("click", function (event) {
   const element = event.target;
   // if (elements) {
   //    elements.checked = false;
   // } else {
   //    elements.checked = true;
   // }
   if (element == allEvents) {
      allEvents.checked = true;
      wildfires.checked = false;
      severeStroms.checked = false;
      volcanoes.checked = false;
      seaLakeIce.checked = false;
      earthquakes.checked = false;
   } else {
      allEvents.checked = false;
      if (wildfires.checked && severeStroms.checked && volcanoes.checked && seaLakeIce.checked && earthquakes.checked) {
         allEvents.checked = true;
         wildfires.checked = false;
         severeStroms.checked = false;
         volcanoes.checked = false;
         seaLakeIce.checked = false;
         earthquakes.checked = false;
      }
   }
});

function displayMessage(string) {
   errorHandle.classList.remove("hide");
   errorHandle.textContent = string;
}

function hideMessage() {
   errorHandle.classList.add("hide");
}
