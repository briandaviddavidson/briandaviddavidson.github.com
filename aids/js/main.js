// JavaScript Document
//console.log("hello world");
//global variables
var map; //map object
var csvData; //array of csv objects
var markerLayers; //markers layer group object
var timestamp = 2000;
var scaleFactor = .35;
var timer; //time for animation
var timerInterval = 1250; //timer length for animation in ms
//begin script when window loads
window.onload = initialize(); //->
//the first function called once the html is loaded

function initialize() {
    //<-window.onload
    setMap();
    processCSV(); //->
};
//set basemap parameters

function setMap() {
    //<-initialize()
    //create the map and set its initial view
    map = L.map('map', {minZoom: 3, maxZoom: 7}).setView([19, 20], 4);
    //add the tile layer to the map
    var layer = L.tileLayer('http://{s}.acetate.geoiq.com/tiles/acetate/{z}/{x}/{y}.png', {noWrap: true}, {
        attribution: 'Acetate tileset from GeoIQ'
    }).addTo(map);

	

    function sequenceInteractions() {
        $(".pause").hide();
       
	    //play behavior
        $(".play").click(function() {
            $(".pause").show();
            $(".play").hide();
            animateMap();
        });
       
	    //pause behavior
        $(".pause").click(function() {
            $(".pause").hide();
            $(".play").show();
            stopMap();
        });
       
	    //forward one function
        $(".step").click(function() {
            step();
			stopMap();
			$(".pause").hide();
            $(".play").show();
        });
       
	    //step-full behavior
        $(".step-full").click(function() {
            jumpForward();
			stopMap();
			$(".pause").hide();
            $(".play").show();
        });
        
		//back one function
		$(".back").click(function() {
			stepBack();
			stopMap();
			$(".pause").hide();
            $(".play").show();
		});
       
	    //step-full behavior
		$(".back-full").click(function() {
            jumpBackward();
			stopmap();
			$(".pause").hide();
            $(".play").show();
        });
		
	
		var minimumTF = false;
		$(".min").click(function() {
			if (minimumTF == false){
				minMarkersLayer.setStyle({opacity: 100});
				minimumTF = true;
			}
			else{
				minimumTF = false;
				minMarkersLayer.setStyle({opacity: 0});
			}
		});
	
		var maximumTF = false;
		$(".max").click(function() {
			if (maximumTF == false){
				maxMarkersLayer.setStyle({opacity: 100});
				maximumTF = true;
			}
			else{
				maximumTF = false;
				maxMarkersLayer.setStyle({opacity: 0});
			}
		});
			
		$("#temporalSlider").slider({
			min: 2000,
			max: 2010,
			step: 1,
			animate: "fast",
			slide: function(e, ui){
				stopMap();
				timestamp = ui.value;
					markersLayer.eachLayer(function(layer) {
					onEachFeature(layer);
					})
			document.getElementById('timeStamp').innerHTML = timestamp;
			}
		});
		
    }
sequenceInteractions();
};

function stopMap() {
    clearInterval(timer);
}

function jump(t) {
    //set the timestamp to the value passed in the parameter
    timestamp = t;
    //upon changing the timestamp, call onEachFeature to update the display
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    });
}

function processCSV() {
    //<-setMap()
    //process the csvData csv file
    var processCSV = new ProcessCSV(); //-> to ProcessCSV.js
    var csv = 'data/csvData.csv'; // set location of csv file
    processCSV.addListener("complete", function() {
        csvData = processCSV.getCSV(); //-> to ProcessCSV.js
        createMarkers();
    });
    processCSV.process(csv); //-> to ProcessCSV.js
};

function createMarkers() {
    //<-ProcessCSV()
    //Radius
    var r = 10;
    //marker style
    var markerStyle = {
        radius: r,
        fillColor: '#F00',
        color: '#F00',
    };
    //create array for markers
    var markersArray = [];
    //create a circle marker for each object in CSV
    for (var i = 0; i < csvData.length; i++) {
        var feature = {};
        feature.properties = csvData[i];
        var lat = Number(feature.properties.latitude);
        var lng = Number(feature.properties.longitude);
        var marker = L.circleMarker([lat, lng], markerStyle);
        marker.feature = feature;
        markersArray.push(marker);
    };
    //create a markers layer with all circle markers
    markersLayer = L.featureGroup(markersArray);
    //add the markers layer to the map
    markersLayer.addTo(map);
    //call function for size
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    })
	
	createMaxMarkers();
	createMinMarkers();
	
}

function createMaxMarkers(){
	var yearsArray = ['2000','2001', '2002','2003','2004','2005','2006','2007','2008','2009','2010'];
	var markerStyle = {
        //fillColor: '#000',
        color: '#000',
		fill: false,
    };
	var maxMarkersArray = [];
	markersLayer.eachLayer(function(layer) {
		var maxV = 0, minV = 50000;
		for(var i=0; i<11;i++){
			if(Number(layer.feature.properties[yearsArray[i]]) > maxV){
				maxV = Number(layer.feature.properties[yearsArray[i]]);
				
			}
		}
		var maxMarker = L.circleMarker([layer._latlng.lat, layer._latlng.lng], markerStyle)
		maxMarker.setRadius(Math.sqrt(maxV * scaleFactor/ Math.PI) );
		maxMarkersArray.push(maxMarker);
    });
	maxMarkersLayer = L.featureGroup(maxMarkersArray);
	
	maxMarkersLayer.addTo(map);
	maxMarkersLayer.setStyle({opacity: 0});

}

function createMinMarkers(){
	var yearsArray = ['2000','2001', '2002','2003','2004','2005','2006','2007','2008','2009','2010'];
	var markerStyle = {
        //fillColor: '#000',
        color: '#B00',
		fill: false,
    };
	var minMarkersArray = [];
	markersLayer.eachLayer(function(layer) {
		var maxV = 0, minV = Infinity;
		for(var i=0; i<11;i++){
			if(Number(layer.feature.properties[yearsArray[i]]) < minV){
				minV = Number(layer.feature.properties[yearsArray[i]]);
			}
		}
		var minMarker = L.circleMarker([layer._latlng.lat, layer._latlng.lng], markerStyle)
		minMarker.setRadius(Math.sqrt(minV * scaleFactor / Math.PI) );
		minMarkersArray.push(minMarker);
    });
	minMarkersLayer = L.featureGroup(minMarkersArray);
	
	minMarkersLayer.addTo(map);
	minMarkersLayer.setStyle({opacity: 0});
	
}

function onEachFeature(layer) {
    //goes back to createMarkers()
    //calcualte area based on the data for that timestamp
    var area = layer.feature.properties[timestamp] * scaleFactor;
    //calculate radius
    var radius = Math.sqrt(area / Math.PI);
    //set the symbol radius
    layer.setRadius(radius);
    //console.log(layer);
    //create and style the HTML in the information popup
    var popupHTML = "<b>" + layer.feature.properties[timestamp] + " deaths</b><br>" + "<i> " + layer.feature.properties.country + "</i> in <i>" + timestamp + "</i>";
    //bind the popup to the feature
    layer.bindPopup(popupHTML, {
        offset: new L.Point(0, -radius)
    });
    //information popup on hover
    layer.on({
        mouseover: function() {
            layer.openPopup();
            this.setStyle({
                radius: radius,
                fillColor: 'grey'
            }); //This is where to change the color for the rollover boarder
        },
        mouseout: function() {
            layer.closePopup();
            this.setStyle({
                fillColor: '#F00'
            });
        }
    });
}

function animateMap() {
    //goes back to setMap()
    timer = setInterval(function() {
        step();
    }, timerInterval);
}

function step() {
    //goes back to animateMap()
    //cycles through all years
    if (timestamp < 2010) {
        timestamp++;
    } else {
        timestamp = 2010; //defaults back to original value
    };
    //onEachFeature will update the display
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    });
    document.getElementById('timeStamp').innerHTML = timestamp;
	updateSlider();
}

function stepBack() {
    //goes back to animateMap()
    //cycles through all years
    if (timestamp > 2000) {
        timestamp--;
    } else {
        timestamp = 2000; //defaults back to original value
    };
    //onEachFeature will update the display
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    });
    document.getElementById('timeStamp').innerHTML = timestamp;
	updateSlider();
}

function jumpBackward() {
    //jumps all the way to 
    if (timestamp != 2000) {
        timestamp = 2000;
    }
    //onEachFeature will update the display
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    });
    document.getElementById('timeStamp').innerHTML = timestamp;
	updateSlider();
}

function jumpForward() {
    //goes back to animateMap()
    //cycles through all years
    if (timestamp != 2010) {
        timestamp = 2010
    }
	//onEachFeature will update the display
    markersLayer.eachLayer(function(layer) {
        onEachFeature(layer);
    });
    document.getElementById('timeStamp').innerHTML = timestamp;
	updateSlider();
}


function updateSlider(){
	
	//move the slider to the appropriate value
	$("#temporalSlider").slider("value",timestamp);
 
}


































