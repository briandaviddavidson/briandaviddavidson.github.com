//begin script when window loads
 window.onload = initialize();

 //the first function called once the html is loaded
function initialize(){
	setMap();
}

//global variables
var keyArray = ["Dropout","White","Asian","Black","Native Am.","Hispanic"]; //array of property keys
var expressed = keyArray[0]; //initial attribute

//set choropleth map parameters
function setMap(){
//retrieve and process counties json file
//map frame dimensions
var width = 960;
var height = 500;

//create a new svg element with the above dimensions
var map = d3.select("#mapContainer")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

 //create counties albers equal area conic projection, centered on France
var projection = d3.geo.albers()
	.center([ 0, 33.5])
	.rotate([81, 0])
	.parallels([30, 35])
	.scale(6500)//return to 6500
	.translate([width / 2, height / 2]);

//create svg path generator using the projection
var path = d3.geo.path()
	.projection(projection);

//processes csv
d3.csv("data/data.csv", function(csvData){
	var recolorMap = colorScale(csvData);
	drawPcp(csvData);
	
	//processes json file
	d3.json("data/education.json", function(error,education){

		//variables for csv to json data transfer
		var jsonCounties = education.objects.counties.geometries;
		//loop through csv to assign each csv values to json
		for (var i=0; i<csvData.length; i++) {
				var csvCounty = csvData[i]; //the current county
				var csvCountyName = csvCounty.name; //county name
				
				//loop through json provinces to find right county
				for (var a=0; a<jsonCounties.length; a++){
					
					//where adm1 codes match, attach csv to json object
					if (jsonCounties[a].properties.NAME == csvCountyName){
							// assign all key/value pairs
							for (var b=0; b<keyArray.length; b++){
								var key = keyArray[b];
								var val = parseFloat(csvCounty[key]);
								jsonCounties[a].properties[key] = val;
							};
							
							jsonCounties[a].properties.name = csvCounty.name; //set prop
							break; //stop looking through the json counties
							};
					};
			};

		
	//add states to map
	var states = map.append("path") //create SVG path element
		.datum(topojson.object(education, education.objects.states))
		.attr("class", "background") //class name for styling
		.attr("d", path); //project data as geometry in svg


	//adds counties
	var counties = map.selectAll(".counties")
		.data(topojson.object(education, education.objects.counties).geometries) 
		.enter() //create elements
		.append("path") //append elements to svg
		.attr("class", "counties") //assign class for additional styling
		.attr("id", function(d) { return d.properties.NAME })
		.attr("d", path) //project data as geometry in svg*/
		.style("fill", function (d) {return choropleth(d, recolorMap);})//color enumeration units
		.on("mouseover", highlight)
		.on("mouseout", dehighlight)
		.on("mousemove", moveLabel)
		.append("desc") //append the current color
			.text(function(d) {
				return choropleth(d, recolorMap);
		
			});

});	
	
});

//Graticule	
var graticule = d3.geo.graticule()
	.step([10, 10]); //place graticule lines every 10 degrees

//create graticule background
var gratBackground = map.append("path")
	.datum(graticule.outline) //bind graticule background
	.attr("class", "gratBackground") //assign class for styling
	.attr("d", path) //project graticule
/*
 //create graticule lines
 var gratLines = map.selectAll(".gratLines") //select graticule elements
	.data(graticule.lines) //bind graticule lines to each element
	.enter() //create an element for each datum
	.append("path") //append each element to the svg as a path element
	.attr("class", "gratLines") //assign class for styling
	.attr("d", path); //project graticule lines

*/
	
};//End of setMap

function colorScale(csvData){

	//create quantile classes with color scale
	var color = d3.scale.quantile() //designate quantile scale generator
		.range([
			"#FFF1D4",
			"#FFE4A8",
			"#FCD781",
			"#F7CB5C",
			"#F0BE35"
		]);
		
		//set min and max data values as domain
	color.domain([
		d3.min(csvData, function(d) { return Number(d[expressed]); }),
		d3.max(csvData, function(d) { return Number(d[expressed]); })
	]);

	//return the color scale generator
	return color;	

};

function choropleth(d, recolorMap){
	//<-setMap d3.json provinces.style
	
	//Get data value
	var value = d.properties[expressed];
	//If value exists, assign it a color; otherwise assign gray
	if (value) {
		
		return recolorMap(value);
	} else {
		return "#FFF";
	};
};


d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

function drawPcp(csvData){
	
	//pcp dimensions
	var width = 1050;
	var height = 200;

	//create attribute names array for pcp axes
	var keys = [], attributes = [];
	
	//fill keys array with all property names
	for (var key in csvData[0]){
		keys.push(key);
	};
	//fill attributes array with only the attribute names
	for (var i=2; i<keys.length; i++){
		attributes.push(keys[i]);
	};

	//create horizontal pcp coordinate generator
	var coordinates = d3.scale.ordinal() //create an ordinal scale for plotting axes
		.domain(attributes) //horizontally space each attribute's axis evenly
		.rangePoints([0, width]); //set the horizontal scale width as the SVG width
	
    var axis = d3.svg.axis() //create axis generator
		.orient("left"); //orient generated axes vertically
	
	//create vertical pcp scale
	scales = {}; //object to hold scale generators
	attributes.forEach(function(att){ //for each attribute
    	scales[att] = d3.scale.linear() //create a linear scale generator for the attribute
        	.domain(d3.extent(csvData, function(data){ //compute the min and max values of the scale
				return +data[att];//create array of data values to compute extent from
			})) 
        	.range([height, 0]); //set the height of each axis as the SVG height
	});

	var line = d3.svg.line(); //create line generator
	
	//create a new svg element with the above dimensions
	var pcplot = d3.select("#mapContainer")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "pcplot") //for styling
		.append("g") //append container element
		.attr("transform", d3.transform( //change the container size/shape
			"scale(0.8, 0.6),"+ //shrink
			"translate(96, 50)")); //move

/*	var pcpBackground = pcplot.append("rect") //background for the pcp
		.attr("x", "-30")
		.attr("y", "-35")
		.attr("width", "1020")
		.attr("height", "270")
		.attr("rx", "15")
		.attr("ry", "15")
		.attr("class", "pcpBackground");*/
 
	//add lines
	var pcpLines = pcplot.append("g") //append a container element
		.attr("class", "pcpLines") //class for styling lines
		.selectAll("path") //prepare for new path elements
		.data(csvData) //bind data
		.enter() //create new path for each line
		.append("path") //append each line path to the container element
		.attr("id", function(d){
			return d.name; //id each line by county name
		})
		.attr("d", function(d){
			return line(attributes.map(function(att){ //map coordinates for each line to arrays object for line generator
			
				return [coordinates(att), scales[att](d[att])]; //x and y coordinates for line at each axis
			}));
		})
		.on("mouseover", highlight)
		.on("mouseout", dehighlight)
		.on("mousemove", moveLabel);

	//add axes	
	var axes = pcplot.selectAll(".attribute") //prepare for new elements
		.data(attributes) //bind data (attribute array)
		.enter() //create new elements
		.append("g") //append elements as containers
		.attr("class", "axes") //class for styling
		.attr("transform", function(d){
			return "translate("+coordinates(d)+")"; //position each axis container
		})
		.each(function(d){ //invoke the function for each axis container element
			d3.select(this) //select the current axis container element
				.call(axis //call the axis generator to create each axis path
					.scale(scales[d]) //generate the vertical scale for the axis
					.ticks(0) //no ticks
					.tickSize(0) //no ticks, I mean it!
				)
				.attr("id", d) //assign the attribute name as the axis id for restyling
				.style("stroke-width", "5px") //style each axis
				.on("click", function(){ //click listener
					sequence(this, csvData);
				});	
		});


	pcplot.select("#"+expressed) //select the expressed attribute's axis for special styling
		.style("stroke-width", "10px");
};


function highlight(data){
	
	var props = datatest(data); //standardize json or csv data
	
	d3.select("#"+props.name) //select the current province in the DOM
	.style("fill", "#000"); //set the enumeration unit fill to black

	//highlight corresponding pcp line
	d3.selectAll(".pcpLines") //select the pcp lines
		.select("#"+props.name) //select the right pcp line
		.style("stroke","#fbce64") //restyle the line
		.moveToFront();
		
	var labelAttribute = "<h1>"+props[expressed]+"</h1><br><b>"+expressed+"</b>"; //label content
	var labelName = props.name; //html string for name to go in child div

	//create info label div
	var infolabel = d3.select("#mapContainer").append("div")
		.attr("class", "infolabel") //for styling label
		.attr("id", props.name) //for label div
		.html(labelAttribute) //add text
		.append("div") //add child div for feature name
		.attr("class", "labelname") //for styling name
		.html(labelName); //add feature name to label
	};
	

function datatest(data){
	if (data.properties){ //if json data
		return data.properties;
	}
	else { //if csv data
		return data;
	};
};

function dehighlight(data){
	var props = datatest(data);	//standardize json or csv data
	var prov = d3.select("#"+props.name); //designate selector variable for brevity
	var fillcolor = prov.select("desc").text(); //access original color from desc
	prov.style("fill", fillcolor); //reset enumeration unit to orginal color
	
	//dehighlight corresponding pcp line
	d3.selectAll(".pcpLines") //select the pcp lines
		.select("#"+props.name) //select the right pcp line
		.style("stroke","#888"); //restyle the line
	
	d3.select(".infolabel").remove(); //remove info label
};


function moveLabel() {
		var x = d3.mouse(this)[0]+25; //horizontal label coordinate based mouse position stored in d3.event
		var y = d3.mouse(this)[1]-25; //vertical label coordinate
		d3.select(".infolabel") //select the label div for moving
			.style("left", x+"px") //reposition label horizontal
			.style("top", y+"px"); //reposition label vertical
};

function sequence(axis, csvData){
		//<-drawPcp axes.each.on("click"...
		
		//restyle the axis
		d3.selectAll(".axes") //select every axis
			.style("stroke-width", "5px"); //make them all thin
		axis.style.strokeWidth = "10px"; //thicken the axis that was clicked as user feedback
		
		expressed = axis.id; //change the class-level attribute variable
		
		//recolor the map
		d3.selectAll(".counties") //select every county
			.style("fill", function(d) { //color enumeration units
				return choropleth(d, colorScale(csvData)); //->
			})
			.select("desc") //replace the color text in each province's desc element
			.text(function(d) {
				return choropleth(d, colorScale(csvData)); //->
			});
	};