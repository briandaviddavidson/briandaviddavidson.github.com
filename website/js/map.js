// Create the map
var map = L.map('map').setView([38.9586310,-77.3570030], 8);

// Set up the OSM layer

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
})

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmRkYXZpZHNvbiIsImEiOiJjaW41MWU5bTcwY2k1dXdtNG54cnhlczFsIn0._R6SrAak5_qF8l31JvSBIA')
.addTo(map);

// add a marker in the given location
L.marker([38.9586310,-77.3570030]).addTo(map);

