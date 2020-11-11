var sn_val = "Confirmed";
// set up color arrays for each mapped attribute - used to style polygons and legend
var covid19colors = {
  Confirmed: ['#bd0026','#f03b20','#fd8d3c','#fecc5c','#ffffb2'],
  Deaths: ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6'],
  FatalityRate: ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6']
}
// set up custom breaks for each mapped attribute
var covid19breaks = {
  Confirmed: [1000, 500, 100, 1, 0],
  Deaths: [500, 100, 50, 1, 0],
  FatalityRate: [5,4,2,1,0]
}
//set up custom popup template strings for each mapped attribute (UGLY LONG STRINGS)
var popup_strings = {
  Confirmed:  '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Confirmed Cases: {Confirmed}</br>Deaths: {Deaths}<br> <a href="{url}" target="_blank">View Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
  Deaths:  '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Confirmed Cases: {Confirmed}</br> Deaths: {Deaths}<br> <a href="{url}" target="_blank">View County Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
  FatalityRa:  '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Fatality Rate: {FatalityRa}% </br>Confirmed Cases: {Confirmed}</br> Deaths: {Deaths}<br> <a href="{url}" target="_blank">View County Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
}

function getStyle(feature) {
  // Function to set the style for the selected layer attribute being mapped
  return {
    //fillColor: getColor(feature['properties'][sn_val], sn_val),
    fillColor: getColor(feature['properties'][sn_val], sn_val),
    fillOpacity: 0.25,
    weight: 0.25,
    opacity: 0.65,
    color: "grey",
  };
}
function getColor(d, v) {
  // Function to get the color map for the selected layer attribute being mapped
  return d == undefined ? "#d3d3d3":
  d >= covid19breaks[v][0] ? covid19colors[v][0] :
  d >= covid19breaks[v][1] ? covid19colors[v][1] :
  d >= covid19breaks[v][2] ? covid19colors[v][2] :
  d >= covid19breaks[v][3] ? covid19colors[v][3] :
  covid19colors[v][4];
}
function highlightFeature(e) {
  var covid = e.target;

  covid.setStyle({
    //weight: 2.5,
    color: '#555',
    dashArray: '',
    fillOpacity: 0.2
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    covid.bringToFront();
  }
}
function resetHighlight(e) {
  // highlight a single feature
  covid = e.target;
  covid.setStyle({
    //weight: 2.5,
    color: getColor(feature['properties'][sn_val], sn_val),
    dashArray: '',
    fillOpacity: 0.2
  });
}

function onEachFeature(feature, covid) {
  // remove hightlighted feature
  covid.on({
    mouseover: highlightFeature,
    mouseout:  resetHighlight
  });
}
