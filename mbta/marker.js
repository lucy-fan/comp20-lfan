var map;

var markers = {
  alewife: {"position": {lat: 42.39674, lng: -71.121815}, "title": "Alewife"},
  davis: {"position": {lat: 42.39674, lng: -71.121815}, "title": "Davis"},
  porterSquare: {"position": {lat: 42.3884, lng: -71.11914899999999}, "title": "Porter Square"},
  harvardSquare: {"position": {lat: 42.373362, lng: -71.118956}, "title": "Harvard Square"},
  centralSquare: {"position": {lat: 42.365486, lng: -71.103802}, "title": "Central Square"},
  kendallMIT: {"position": {lat: 42.36249079, lng: -71.08617653}, "title": "Kendall/MIT"},
  charlesMGH: {"position": {lat: 42.361166, lng: -71.070628}, "title": "Charles/MGH"},
  parkStreet: {"position": {lat: 42.35639457, lng: -71.0624242}, "title": "Park Street"},
  downtownCrossing: {"position": {lat: 42.355518, lng: -71.060225}, "title": "Downtown Crossing"},
  southStation: {"position": {lat: 42.352271, lng: -71.05524200000001}, "title": "South Station"},
  broadway: {"position": {lat: 42.342622, lng: -71.056967}, "title": "Broadway"},
  andrew: {"position": {lat: 42.330154, lng: -71.057655}, "title": "Andrew"},
  jfkUmass: {"position": {lat: 42.320685, lng: -71.052391}, "title": "JFK/UMass"},
  northQuincy: {"position": {lat: 42.275275, lng: -71.029583}, "title": "North Quincy"},
  wollaston: {"position": {lat: 42.2665139, lng: -71.0203369}, "title": "Wollaston"},
  quincyCenter: {"position": {lat: 42.251809, lng: -71.005409}, "title": "Quincy Center"},
  quincyAdams: {"position": {lat: 42.233391, lng: -71.007153}, "title": "Quincy Adams"},
  brainTree: {"position": {lat: 42.2078543, lng: -71.0011385 }, "title": "Braintree"},
  savinHill: {"position": {lat: 42.31129, lng: -71.053331}, "title": "Savin Hill"},
  fieldsCorner: {"position": {lat: 42.300093, lng: -71.061667}, "title": "Fields Corner"},
  shawmut: {"position": {lat: 42.29312583, lng: -71.06573796000001}, "title": "Shawmut"},
  ashmont: {"position": {lat: 42.284652, lng: -71.06448899999999}, "title": "Ashmont"},
}

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.352271, lng: -71.05524200000001},
      zoom: 13
   });

   createMarkers();
   createRedLine();
   getLocation();
}

// loops through the markers object and 
// runs each one through addMarker()

function createMarkers() {
  var keys = Object.keys(markers);
  for (var key in markers) {
    addMarker(markers[key]["position"], markers[key]["title"]);
  }

}

// creates a marker and puts it on the map
function addMarker(location, name) {
  var image = 'icon.png';
  var marker = new google.maps.Marker({
    position: location,
    title: name,
    icon: image
  });

  marker.setMap(map);
}


//creates two polylines to represent the branching at JFK

function createRedLine() {
  var coordinates = [];
  var counter = 0;
  for (var key in markers) {
    if (counter == 18) {
      break;
    }
    coordinates[counter] = markers[key]["position"];
    counter++;
  }

  // Alewife to Braintree
  var redLine = new google.maps.Polyline({
    path: coordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 2.0,
    strokeWeight: 4
  });

  redLine.setMap(map);

  // first coordinates are of JFK/UMass
  var altCoordinates = [ {lat: 42.320685, lng: -71.052391} ];
  counter = 0;
  for (var key in markers) {
    if (counter > 17) {
      altCoordinates.push(markers[key]["position"]);
    }
    counter++;
  }

  // JFK/UMass to Ashmont
  var altRedLine = new google.maps.Polyline({
    path: altCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 2.0,
    strokeWeight: 4
  });

  altRedLine.setMap(map);
}

// sees if navigator.geolocation works on user's browser
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
}


//finds user latitude and longitude and creates marker for user's position
function showPosition(position) {
  var userLat = position.coords.latitude;
  var userLng = position.coords.longitude;

  var marker = new google.maps.Marker({
    position: {lat: userLat, lng: userLng},
    title: "Current Location"
  });

  marker.setMap(map);
}