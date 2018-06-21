var map;

var markers = {
     alewife: {"position": {lat: 42.39674, lng: -71.121815}, "title": "Alewife", "id": "place-alfcl"},
     davis: {"position": {lat: 42.39674, lng: -71.121815}, "title": "Davis", "id": "place-davis"},
     porterSquare: {"position": {lat: 42.3884, lng: -71.11914899999999}, "title": "Porter Square", "id": "place-portr"},
     harvardSquare: {"position": {lat: 42.373362, lng: -71.118956}, "title": "Harvard Square", "id": "place-harsq"},
     centralSquare: {"position": {lat: 42.365486, lng: -71.103802}, "title": "Central Square", "id": "place-cntsq"},
     kendallMIT: {"position": {lat: 42.36249079, lng: -71.08617653}, "title": "Kendall/MIT", "id": "place-knncl"},
     charlesMGH: {"position": {lat: 42.361166, lng: -71.070628}, "title": "Charles/MGH", "id": "place-chmnl"},
     parkStreet: {"position": {lat: 42.35639457, lng: -71.0624242}, "title": "Park Street", "id": "place-pktrm"},
     downtownCrossing: {"position": {lat: 42.355518, lng: -71.060225}, "title": "Downtown Crossing", "id": "place-dwnxg"},
     southStation: {"position": {lat: 42.352271, lng: -71.05524200000001}, "title": "South Station", "id": "place-sstat"},
     broadway: {"position": {lat: 42.342622, lng: -71.056967}, "title": "Broadway", "id": "place-brdwy"},
     andrew: {"position": {lat: 42.330154, lng: -71.057655}, "title": "Andrew", "id": "place-andrw"},
     jfkUmass: {"position": {lat: 42.320685, lng: -71.052391}, "title": "JFK/UMass", "id": "place-jfk"},
     northQuincy: {"position": {lat: 42.275275, lng: -71.029583}, "title": "North Quincy", "id": "place-nqncy"},
     wollaston: {"position": {lat: 42.2665139, lng: -71.0203369}, "title": "Wollaston", "id": "place-wlsta"},
     quincyCenter: {"position": {lat: 42.251809, lng: -71.005409}, "title": "Quincy Center", "id": "place-qnctr"},
     quincyAdams: {"position": {lat: 42.233391, lng: -71.007153}, "title": "Quincy Adams", "id": "place-qamnl"},
     brainTree: {"position": {lat: 42.2078543, lng: -71.0011385 }, "title": "Braintree", "id": "place-brntn"},
     savinHill: {"position": {lat: 42.31129, lng: -71.053331}, "title": "Savin Hill", "id": "place-shmnl"},
     fieldsCorner: {"position": {lat: 42.300093, lng: -71.061667}, "title": "Fields Corner", "id": "place-fldcr"},
     shawmut: {"position": {lat: 42.29312583, lng: -71.06573796000001}, "title": "Shawmut", "id": "place-smmnl"},
     ashmont: {"position": {lat: 42.284652, lng: -71.06448899999999}, "title": "Ashmont", "id": "place-asmnl"}
}

var marker_times = {};

/////////////////////////////////////////////////////////
// initMap();
//   initializes map and runs other functions
/////////////////////////////////////////////////////////
function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
               center: {lat: 42.352271, lng: -71.05524200000001},
               zoom: 13
      });
      createMarkers();
      createRedLine();
      getLocation();
}

/////////////////////////////////////////////////////////
// createMarkers();
//   loops through the markers object and 
//   runs each one through addMarker()
/////////////////////////////////////////////////////////
function createMarkers() {
     var keys = Object.keys(markers);
     for (var key in markers) {
          addMarker(markers[key]["position"], markers[key]["title"], key);
     }

}

/////////////////////////////////////////////////////////
// addMarker(); 
//   creates a marker and puts it on the map
/////////////////////////////////////////////////////////
function addMarker(location, name, key) {
     var image = 'icon.png';
     var marker = new google.maps.Marker({
          position: location,
          title: name,
          icon: image
     });

     marker.setMap(map);
     marker_times[key] = marker;

     upcomingTrains(markers[key]["id"], addTimes, key);
}

/////////////////////////////////////////////////////////
// upcomingTrains();
//   gets times of upcoming trains
/////////////////////////////////////////////////////////
function upcomingTrains(id, call, key) {
     var upcomingTimes = "";
     var url = "https://defense-in-derpth.herokuapp.com/redline/schedule.json?stop_id=" + id;
     var xhttp = new XMLHttpRequest();
     xhttp.overrideMimeType("application/json");
     xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
               var parsed = JSON.parse(this.responseText);
               for (x in parsed["data"]) {
                    if (parsed["data"][x]["attributes"]["direction_id"] == 0) {
                         var direction = "Southbound";
                    }
                    else {
                         var directiont = "Northbound";
                    }
                    if (x == "wollaston") {
                         upcomingTimes += "No upcoming trains today.";
                    }
                    else {
                         upcomingTimes += "Arrival time: " + parsed["data"][x]["attributes"]["arrival_time"] + ", Departure time: " + parsed["data"][x]["attributes"]["departure_time"] + ", " + direction + "<br>";
                    }
               }
               call(key, upcomingTimes);
          }
     };
     xhttp.open("GET", url, true);
     xhttp.send();
}

/////////////////////////////////////////////////////////
// addTimes();
//   creates and adds upcoming times to infowindow
/////////////////////////////////////////////////////////
function addTimes(key, times) {
     var contentString = 
     '<h1>Upcoming Trains</h1><p>' + times + '</p>';

     var infowindow = new google.maps.InfoWindow({
          content: contentString
     });

     marker_times[key].addListener('click', function() {
          infowindow.open(map, marker_times[key]);
     });
}

/////////////////////////////////////////////////////////
// createRedLine();
//   creates two polylines to represent the branching at JFK
/////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////
// getLocation();
//   sees if navigator.geolocation works on user's browser
/////////////////////////////////////////////////////////
function getLocation() {
     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
     } 
}

/////////////////////////////////////////////////////////
// showPosition();
//   finds user latitude and longitude 
//   and creates marker for user's position
/////////////////////////////////////////////////////////
function showPosition(position) {
     var userLat = position.coords.latitude;
     var userLng = position.coords.longitude;

     var marker = new google.maps.Marker({
          position: {lat: userLat, lng: userLng},
          title: "Current Location"
     });

     marker.setMap(map);

     var contentString = 
     '<p>The closest MBTA Red Line Subway Station is: '+
     closestStation(position);

     var infowindow = new google.maps.InfoWindow({
          content: contentString
     });

     marker.addListener('click', function() {
          infowindow.open(map, marker);
     });

}

/////////////////////////////////////////////////////////
// closestStation();
//   finds the closest station from user's location 
//   and returns the title of that station
/////////////////////////////////////////////////////////
function closestStation(position) {
     var userLatLng = new google.maps.LatLng({lat: position.coords.latitude, lng: position.coords.longitude});
     var closest = "brainTree";

     var keys = Object.keys(markers);
     for (var key in markers) {
          var currentLatLng = new google.maps.LatLng(markers[closest]["position"]);
          var keyLatLng= new google.maps.LatLng(markers[key]["position"]);
          var currentDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, currentLatLng);
          var keyDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, keyLatLng);
          if (keyDistance < currentDistance) {
               closest = key;
          }
     }

     shortestRoute(position, closest);

     return markers[closest]["title"];
}

/////////////////////////////////////////////////////////
// shortestRoute();
//   creates polyline between 
//   user location and closest station
/////////////////////////////////////////////////////////
function shortestRoute(position, station) {
     var coordinates = [
     {lat: position.coords.latitude, lng: position.coords.longitude},
     markers[station]["position"]
     ]

     var route = new google.maps.Polyline({
     path: coordinates,
     geodesic: true,
     strokeColor: '#000000',
     strokeOpacity: 2.0,
     strokeWeight: 4
     });

     route.setMap(map);
}