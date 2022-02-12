
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
let eventCount = 60;
let searchText = document.getElementById("search-city");
let dataRefreshBtn = $("#data-refresh-btn");
const dateFrom = document.getElementById("from");
const dateTo = document.getElementById("to");
const allEvents = document.getElementById("checkbox-radio-option-all");
const wildfires = document.getElementById("checkbox-radio-option-one");
const severeStroms = document.getElementById("checkbox-radio-option-two");
const volcanoes = document.getElementById("checkbox-radio-option-three");
const seaLakeIce = document.getElementById("checkbox-radio-option-four");
const earthquakes = document.getElementById("checkbox-radio-option-five");
const errorHandle = document.getElementById("error-message");

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
   layerGroup.clearLayers();
   //query eonet API

   if (dateEnd >= dateStart) {
      let queryEONET = `https://eonet.sci.gsfc.nasa.gov/api/v3/events?bbox=${minLong},${maxLat},${maxLong},${minLat}&start=${dateStart}&end=${dateEnd}&limit=${eventCount}&status=all`;
      fetch(queryEONET)
         .then(response => response.json())
         .then(data => {
            console.log(data.events);
            let pointList = [];
            let polygonPoints = [];
            if (data.events.length > 0) {
               let eventData = [];
               if (allEvents.checked) {
                  eventData = data.events;
                  console.log(eventData);
               } else {
                  let tempData = data.events;
                  console.log(tempData);
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
                        console.log("No Volcano event happened!");
                        displayMessage("No Volcano event happened!");
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
                     console.log(eventData[index].geometry[0].type);
                     // if (data.events[index].geometry.length > 2 && data.events[index].geometry[0].type !== "Polygon"){
                     if (eventData[index].geometry[0].type !== "Polygon") {
                        if (eventData[index].geometry.length > 2) {
                           //build polyline points array
                           for (let i = 0; i < eventData[index].geometry.length; i++) {
                              // console.log(`${data.events[index].title} is greater than 2`);
                              // polyLineAry.push (data.events[index].geometry[i].coordinates);
                              pointList.push(new L.LatLng(eventData[index].geometry[i].coordinates[1], eventData[index].geometry[i].coordinates[0]));
                              // console.log(pointList[i]);
                           };
                           //add polyline to map
                           // console.log(pointList);
                           let drawPolyline = new L.polyline(pointList, {
                              color: 'red',
                              weight: 2,
                              opacity: 0.25,
                              smoothFactor: 1
                           });
                           drawPolyline.addTo(layerGroup);
                           pointList = [];
                        };
                        let date = new Date(eventData[index].geometry[0].date);
                        let eventMarker = L.marker([eventData[index].geometry[0].coordinates[1], eventData[index].geometry[0].coordinates[0]]);
                        eventMarker.addTo(layerGroup)
                           .bindPopup(`${eventData[index].title} -\n Date/Time: ${date.toString()}`); //marker description with date
                     }
                     else {
                        //pseudo code: add polygon here
                        console.log(`There was a polygon`);
                        // console.log(data.events[index].geometry[0].coordinates[0]);
                        for (let i = 0; i < eventData[index].geometry[0].coordinates[0].length; i++) {
                           polygonPoints.push([eventData[index].geometry[0].coordinates[0][i][1], eventData[index].geometry[0].coordinates[0][i][0]]);
                        };
                        console.log(polygonPoints);
                        let polygon = new L.polygon(polygonPoints, {
                           color: 'orange',
                           opacity: 0.25,
                        });
                        polygon.addTo(layerGroup);
                        polygonPoints = [];
                     };
                  }
                  displayMessage(`${eventData.length} event(s) found between ${dateStart} and ${dateEnd}`);
               } else {
                  console.log(`No event found in this area between ${dateStart} and ${dateEnd}`);
                  displayMessage(`No event found in this area between ${dateStart} and ${dateEnd}`);
               }
            } else {
               console.log(`No event found in this area between ${dateStart} and ${dateEnd}`);
               displayMessage(`No event found in this area between ${dateStart} and ${dateEnd}`);
            }
         });
   };
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
   // layerGroup.clearLayers();

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
   setDatePicker();  // Setting datePicker default value
   localStorage.clear();
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
   todayMinus.setDate(todayMinus.getDate() - 30); // today minus 30 days
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
}


function showFormResults() {
   dateStart = dateFrom.value;
   dateEnd = dateTo.value;
   getNewBoundaries();
   dataPull();
   let mapCenterLat = (maxLat + minLat) / 2;
   let mapCenterLon = (maxLong + minLong) / 2;
   localStorage.setItem("Lat", mapCenterLat);
   localStorage.setItem("Lon", mapCenterLon);
};

//Open Options Menu
$('#menu-open-btn').on('click', function (event) {
   event.preventDefault();
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
