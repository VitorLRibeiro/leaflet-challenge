var url;
var legend;
var layerscontrol;
var legendOptions;

// Define Map div
var myMap = L.map("map", {
    center: [39.0119, -98.4842],
    zoom: 4
  });

// Define Data Endpoints
  function optionChanged(newSample) {
    var url
    if(newSample =="7 Days" ){
      url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    }else if(newSample == "Significant 30 Days" ){
      url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
    };
    d3.json(url).then(function(data) { 
      console.log(data)
    
      updateMap(data.features);
    });
  };

  function createLayers(features){
  
    var eqMarkers = []
    
      for (var i = 0; i < features.length; i++) {
         console.log(i);

            var latLong = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];

            var mag = features[i].properties.mag;
            console.log(mag);
        
            var place = features[i].properties.place;
        
            if (mag > 5){
                eqMarkers.push(
                L.circle(latLong, mag*10000).setStyle({
                fillColor :'red',
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place +
                "</h5><hr><p>Mag " + mag + "</p>"));
        
            }else if (mag > 4){
                eqMarkers.push(
                L.circle(latLong, mag*10000).setStyle({
                fillColor :'orange', 
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place +"</h5><hr><p>Mag " + mag + "</p>"));
            
            }else if (mag > 3){
                eqMarkers.push(
                L.circle(latLong, mag*10000).setStyle({
                fillColor :'yellow', 
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place +"</h5><hr><p>Mag " + mag + "</p>"));
              
            }else if (mag > 2){
                eqMarkers.push(
                L.circle(latLong, mag*10000).setStyle({
                fillColor :'green', 
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place + "</h5><hr><p>Mag " + mag + "</p>"));
            
            }else if (mag > 1){
                eqMarkers.push(
                L.circle(latLong, mag*10000).setStyle({
                fillColor :'grey', 
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place +"</h5><hr><p>Mag " + mag + "</p>"));
            
            }else{
                eqMarkers.push(
                L.circle(latLong, mag*1000).setStyle({fillColor :'white', 
                fillOpacity: 0.75, 
                color:"transparent"}).bindPopup("<h5>" + place +"</h5><hr><p>Mag " + mag + "</p>"));
            }          
          }
          console.log(place);
        
          legend = L.control({position: 'bottomright'});
        
          function getColor(s) {
            return s> 5   ? 'red' :
                   s > 4   ? 'orange' :
                   s > 3   ? 'yellow' :
                   s > 2   ? 'green' :
                   s > 1   ? 'grey' :
                            'white';
          }
        
          legend.onAdd = function (myMap) {
          
            var div = L.DomUtil.create('div', 'Legend'),
            mag = [0,1,2,3,4,5],
            labels = [">5","4","3","2","1","<1" ];
        
              // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < mag.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                    mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
            }
            return div;
          };
          legendOptions = legend.addTo(myMap);
        
          addLayers(eqMarkers);
        }
        function addLayers(data){
             // Streetmap and Darkmap as Layer Choice
          var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
          });
        
          var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
          }).addTo(myMap);
        
          // Create Basemap to hold Map Layers
          var baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
          };
          Earthquakes = L.layerGroup(data);
          Earthquakes.addTo(myMap);
        
          // Overlay Object
          var overlayMaps = {
            Earthquakes: Earthquakes
          };
        
          // Display Maps on Load
        
        
          layerscontrol = L.control.layers(baseMaps, overlayMaps).addTo(myMap)
          .addTo(myMap);
          
        };
        
        function init() {
          // Drop Down
          var selector = d3.select("#selDataset");
            // Use the list of sample names to populate the select options
          var data_list = ["7 Days", "Significant 30 Days"]
        
          data_list.forEach((s) => {
            selector
              .append("option")
              .text(s)
              .property("value", s);
        });
          // Use the first sample from the list to build the initial plots
          const firstSample = data_list[0];
          
          if(firstSample == "7 Days" ){
            url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
          }else if(firstSample == "Significant 30 Days" ){
            url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
          };
        
          d3.json(url).then(function(data) { 
            console.log(data)
          
            createLayers(data.features);
          
        });
      };
        // Initialize the dashboard
        init();
        
        
        function updateMap(sample){
          myMap.eachLayer(function (layerscontrol) {
          myMap.removeLayer(layerscontrol);
        });
          myMap.removeControl(layerscontrol);
          myMap.removeControl(legendOptions)
          createLayers(sample);
        
        }