// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
    


function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  //Include popups that provide additional information about the earthquake when its associated marker is clicked.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<b>Location:  </b>"+ feature.properties.place + 
    "<br><b>Magnitude: </b>" + feature.properties.mag + 
    "<br><b>Depth: </b>" + feature.geometry.coordinates[2]);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      // Use styleEarthquake function to style each earthquake marker
      return L.circleMarker(latlng, styleEarthquake(feature));}
  });

  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      0.789, 113.9
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add legend
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 20, 30, 40, 50]; // Adjust the depth ranges as needed
    let labels = ["#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"];

    // loop through depth ranges and generate a label with a colored square for each range
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + labels[i] + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }
    return div;
  };
  legend.addTo(myMap);
}

//Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. 
//Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
function styleEarthquake(feature) {
  return {
  fillOpacity: 1,
  fillColor: getColor(feature.geometry.coordinates[2]),
  color: "black",
  radius: getRadius(feature.properties.mag),
  weight: 0.5,
  stroke: true
}
};

function getColor(depth) {
  // Map depth to a color scale
  // Adjust these values according to your preference
  if (depth > 50) {
      return "#ea2c2c";
  } else if (depth > 40) {
      return "#ea822c";
  } else if (depth > 30) {
      return "#ee9c00";
  } else if (depth > 20) {
      return "#eecc00";
  } else if (depth > 10) {
      return "#d4ee00";
  } else {
      return "#98ee00";
  }};

function getRadius(mag) {
  return (Math.pow(mag, 2) + 2) / 2;
};

});

//Create a legend that will provide context for your map data.
