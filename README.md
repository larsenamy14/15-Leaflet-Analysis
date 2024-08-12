# 15-Leaflet-Analysis

![image](https://github.com/user-attachments/assets/440d3108-b925-4282-8910-62189532e1f9)

In this activity, creating the legend was tricky. This required updating the css as well as the javascript code. 

## CSS:
.legend {
    padding: 5px;
    color: #555;
    background-color: #fff;
}

.legend i {
    float: left;
    width: 10px;
    height: 10px;
    opacity: 0.8;
}

## Javascript
// Create legend for map
let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 20, 30, 40, 50];
    let labels = ["#98ee00","#d4ee00","#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    // loop through depth ranges and generate a label with a colored square for each range
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + labels[i] + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }
    return div;
  };
  legend.addTo(myMap);
