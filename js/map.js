var southWest = L.latLng(39.902990, -78.394562);
var northEast = L.latLng(37.902990, -76.394562);
var bounds = L.latLngBounds (southWest, northEast)

var map = L.map('map', {
    zoomControl: false,
    maxBounds: bounds
}).setView([38.902990, -77.394562], 11);

var tiles = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles © <a href="http://www.stamen.com">stamen design</a>',
}).addTo(map);

map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

var marker = L.marker([38.902990, -77.394562]).addTo(map);

marker.bindPopup("<div> Please feel free to contact me about maps, UI/UX design and development, or if you just want to chat!<br/><br/><li>Email: <a href='mailto:briandaviddavidson@gmail.com'>briandaviddavidson@gmail.com</a></li><li>Phone: (404) 641-7629</li></div>").openPopup();