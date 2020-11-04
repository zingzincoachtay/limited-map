// set up color arrays for each mapped attribute - used to style polygons and legend
var mycolors = {
  Confirmed: ['#bd0026','#f03b20','#fd8d3c','#fecc5c','#ffffb2'],
  Deaths: ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6'],
  FatalityRate: ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6']
}

// set up custom breaks for each mapped attribute
var mybreaks = {
  Confirmed: [1000, 500, 100, 1, 0],
  Deaths: [500, 100, 50, 1, 0],
  FatalityRate: [5,4,2,1,0]
}

function getStyle(feature) {
  // Function to set the style for the selected layer attribute being mapped
  return {
    fillColor: getColor(feature['properties'][sn_val], sn_val),
    fillOpacity: 0.85,
    weight: 0.25,
    opacity: 0.65,
    color: "grey",
  };
}

function getColor(d, v) {
  // Function to get the color map for the selected layer attribute being mapped
  return d == undefined ? "#d3d3d3":
  d >= mybreaks[v][0] ? mycolors[v][0] :
  d >= mybreaks[v][1] ? mycolors[v][1] :
  d >= mybreaks[v][2] ? mycolors[v][2] :
  d >= mybreaks[v][3] ? mycolors[v][3] :
  mycolors[v][4];
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(e) {
  // highlight a single feature
  layer = e.target;
  layer.setStyle({
    weight: 0.5,
    color: 'grey',
    dashArray: '',
    fillOpacity: 0.7
  });
}

function onEachFeature(feature, layer) {
  // remove hightlighted feature
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}
