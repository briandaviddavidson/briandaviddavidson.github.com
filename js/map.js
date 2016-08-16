var southWest = L.latLng(39.902990, -78.394562);
var northEast = L.latLng(37.902990, -76.394562);
var bounds = L.latLngBounds (southWest, northEast)

var map = L.map('map', {
    zoomControl: false,
    maxBounds: bounds
}).setView([38.9586310, -77.3570030], 11);

// Set up the OSM layer

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
})

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmRkYXZpZHNvbiIsImEiOiJjaW41MWU5bTcwY2k1dXdtNG54cnhlczFsIn0._R6SrAak5_qF8l31JvSBIA')
.addTo(map);

// add a marker in the given location
var marker = L.marker([38.9586310,-77.3570030]).addTo(map);

// marker.bindPopup("<div> Please feel free to contact me about maps, UI/UX design and development, or if you just want to chat!<br/><br/><li>Email: <a href='mailto:briandaviddavidson@gmail.com'>briandaviddavidson@gmail.com</a></li><li>Phone: (404) 641-7629</li></div>").openPopup();

