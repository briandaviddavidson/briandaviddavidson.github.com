var southWest = L.latLng(39.391485, -77.585378);
var northEast = L.latLng(38.391485, -76.585378);
var bounds = L.latLngBounds (southWest, northEast)

var map = L.map('map', {
    zoomControl: false,
    maxBounds: bounds
}).setView([38.891485, -77.085378], 12);

// Set up the OSM layer

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmRkYXZpZHNvbiIsImEiOiJjaW41MWU5bTcwY2k1dXdtNG54cnhlczFsIn0._R6SrAak5_qF8l31JvSBIA')
.addTo(map);

// add a marker in the given location
var marker = L.marker([38.891485, -77.085378]).addTo(map);

// marker.bindPopup("<div> Please feel free to contact me about maps, UI/UX design and development, or if you just want to chat!<br/><br/><li>Email: <a href='mailto:hello@briandaviddavidson.com'>hello@briandaviddavidson.com</a></li><li>Phone: (404) 641-7629</li></div>").openPopup();

