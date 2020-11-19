var sn_val = "Confirmed";
// set up color arrays for each mapped attribute - used to style polygons and legend
var covid19colors = {
  Confirmed:  ['#bd0026','#f03b20','#fd8d3c','#fecc5c','#ffffb2'],
  Deaths:     ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6'],
  FatalityRa: ['#980043','#dd1c77','#df65b0','#d7b5d8','#f1eef6']
}
// set up custom breaks for each mapped attribute
var covid19breaks = {
  Confirmed:  [1000, 500, 100, 1, 0],
  Deaths:     [500, 100, 50, 1, 0],
  FatalityRa: [5, 4, 2, 1, 0]
}
//set up custom popup template strings for each mapped attribute (UGLY LONG STRINGS)
var popup_strings = {
  Confirmed:  '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Confirmed Cases: {Confirmed}</br>Deaths: {Deaths}<br> <a href="{url}" target="_blank">View Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
  Deaths:     '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Confirmed Cases: {Confirmed}</br>Deaths: {Deaths}<br> <a href="{url}" target="_blank">View County Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
  FatalityRa: '<h3>{Countyname} County, {ST_Abbr}</h3><hr>Fatality Rate: {FatalityRa}% </br>Confirmed Cases: {Confirmed}</br> Deaths: {Deaths}<br> <a href="{url}" target="_blank">View County Status Report</a> <p><em>last updated: {DateChecke}</em></p>',
}

function getStyle(feature) {
  // Function to set the style for the selected layer attribute being mapped
  return {
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

function epidemicCOVID(Layer,map) {
  var cendata = "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0";
  var mCOVID = L.esri.featureLayer({
    url: cendata,
    style: getStyle,
    onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID);
  return {
    "<a href='javascript:setCOVIDmap(1)'>COVID Confirmed</a>" : mCOVID,
    "<a href='javascript:setCOVIDmap(2)'>COVID Deaths</a>"    : mCOVID,
    "<a href='javascript:setCOVIDmap(3)'>COVID FatalityRa</a>" : mCOVID
  }
  //Layer.control.layers({},hazLayers,{collapsed:false,hideSingleBase:true,autoZIndex:false}).addTo(map);
  //return hazLayers.Topography.addTo(map);
}
function PopupCOVID(e){
  //uncomment and click on  a feature in the map to see all available fields you can add top popup
  //console.log(e.feature.properties)

  // Note we could just pass in e.features.properties to L.Util.template but we do not
  // so that we can format the number of significant digits displayed for the Fatality Rate (FatalityRate)
  //return L.Util.template(popup_strings[sn_val], e.feature.properties);
  x = e.feature.properties;
  return L.Util.template(popup_strings[sn_val], {
    Countyname: x.Countyname, ST_Abbr: x.ST_Abbr, Confirmed: x.Confirmed, Deaths: x.Deaths, FatalityRa: x.FatalityRa.toFixed(1), url: x.url, DateChecke: x.DateChecke
  });
}

function epidemicCOVID2(Layer,map) {
  // See: https://dlab.berkeley.edu/blog/data-and-tools-mapping-covid-19
  // See: http://esri.github.io/esri-leaflet/examples/
  // See: https://dlab-geo.github.io/webmaps/covid-19/covid-js.html
  // See: https://github.com/dlab-geo/webmaps/blob/master/covid-19/covid-js.html
  var cendata = L.esri.featureLayer({
      url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0",
      style: getStyle,
      onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID).addTo(map);// Can add bindPopup with featureLayer
  // Set the default style for the polygons
  // ?? Not sure why getStyle is called here for the second time.
  //   >> Comment out for the moment until I figure out.
  //cendata.setStyle(getStyle);
  // Set the default popup template
  //   >> Comment out while bindPopup is attached to featureLayer
  //cendata.bindPopup(PopupCOVID);

  /* // Not a problem with the Layer Control. The global variables do not change when selecting layers.
  sn_val = "Confirmed";
  var mConfirmed = L.esri.featureLayer({
    url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0",
    style: getStyle,
    onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID);
  sn_val = "Deaths";
  var mDeaths = L.esri.featureLayer({
    url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0",
    style: getStyle,
    onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID);
  sn_val = "FatalityRa";
  var mFatalityRa = L.esri.featureLayer({
    url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0",
    style: getStyle,
    onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID);
  var hazLayers = {
    "Confirmed" : mConfirmed,
    "Deaths" : mDeaths,
    "FatalityRa" : mFatalityRa
  }
  Layer.control.layers({},hazLayers,{collapsed:false,hideSingleBase:true,autoZIndex:false}).addTo(map);
  return hazLayers.Topography.addTo(map);
  */
}
