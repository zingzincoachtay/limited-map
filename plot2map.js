var map,L,markers;
var leafletmaplayer = 'map';
var origins = [
  {"c":[39.640784,-86.831823],"z":1000,"name":"Heartland Automotive"},
  {"c":[40.363639,-86.835809],"z":999,"name":"Heartland Automotive - Lafayette"}
];
var CirclesInMiles = [100,200,300,500,1000];
//var CirclesColors = [];

function DrawBaseMapLayer(Layer,map){
  return Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}
function placeOrigin(x,Layer,map){
  Layer.Icon.Default.prototype.options.iconSize = [20,30];
  // Choose mouseover popup versus onclick popup
  var p = Layer.marker(x.c,{
    //"title" : x.name,
    "keyboard" : true,
    "zIndexOffset":x.z}).addTo(map);
  return p.bindPopup(x.name+"<BR>",{autoClose:false});
  //return p.bindPopup(x.name+"<BR>",{autoClose:false}).openPopup();
}
function placeMarker(x,Layer,map){
  var p = Layer.marker(x.c,{
    //"title" : x.name, // enable a mouseover popup
    "keyboard" : false
  }).addTo(map);
  return p.bindPopup(x.name+"<BR>",{autoClose:false});
  //return p.bindPopup(x.name+"<BR>",{autoClose:false}).openPopup();
}
function onMapClick(e){
  if( typeof markers === 'undefined' ){
    // /*
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked on "+ e.latlng.toString())
      .openOn(map);
    // */
  } else {
    var nearbyMarkers = distancesOf([e.latlng.lat,e.latlng.lng]);
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked near " + nearbyMarkers.name)
      .openOn(map);
  }
}
function donotrepeat(o) {
  var strExists = {}; strExists[o.name] = true;
  return ( strExists[this] ) ? true : false;
}
function distancesOf(origin){
  var BigD = [];
  for(m of markers){
    if( BigD.find(donotrepeat,m) ) continue;
    var LittleD = unit_great_circle_distance(
      {Lat:origin[0],Lon:origin[1]},
      {Lat:m.Latitude,Lon:m.Longitude}
    );
    BigD.push({name:m.Supplier,span:LittleD});
  }
  return nearby( [...new Set(BigD)] );
}
function nearby(d){
  var recent = d.pop();
  d.forEach((gcd, i) => {
    if(recent.span>gcd.span)  recent = gcd;
  });
  return recent;
}
function hazardLayers(phenom,L,map) {
  // Pulling data from NOAA and USGS
  // https://viewer.nationalmap.gov/services/
  // https://www.weather.gov/gis/WebServices
  // https://nowcoast.noaa.gov/help/#!section=map-service-list
  // Go to Capability > Layer > Layer > Name to find the layer name to parse.

  Clouds(L,map);
  if( /^hurricane$/i.test(phenom) ) hazardHurricane(L,map);
  if( /^warnings$/i.test(phenom) ) weatherWarnings(L,map);
  if( /^covid$/i.test(phenom) ) epidemicCOVID(L,map);
}
function Clouds(Layer,map) {
  // Recent Weather Radar Imagery
  // Updated every 5 seconds, lasting several hours?
  // Reference: https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  return Layer.tileLayer.wms("https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer",
    nowCOAST('1')
  ).addTo(map);
}
function hazardHurricane(Layer,map) {
  // Watches, Warnings, and Track/Intensity Forecasts
  // https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  var hazXML = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer";
  var hazLayers = {
    //SurfaceWindSwath:   Layer.tileLayer.wms(hazXML, nowCOAST('2') ),
    //ForecastWindExtent: Layer.tileLayer.wms(hazXML, nowCOAST('7') ),
    "Observed-Track and Eye": Layer.tileLayer.wms(hazXML, nowCOAST('4,3') ),
    "Forecast-Track, Eye and Cone": Layer.tileLayer.wms(hazXML, nowCOAST('9,8,6') ),
    "Siren Zone": Layer.tileLayer.wms(hazXML, nowCOAST('10') )
  };
  Layer.control.layers({},hazLayers,{collapsed:false,hideSingleBase:true,autoZIndex:false}).addTo(map);
  return hazLayers.Topography.addTo(map);
}
function epidemicCOVID(Layer,map) {
  // See: https://dlab.berkeley.edu/blog/data-and-tools-mapping-covid-19
  // See: http://esri.github.io/esri-leaflet/examples/
  // See: https://dlab-geo.github.io/webmaps/covid-19/covid-js.html
  // See: https://github.com/dlab-geo/webmaps/blob/master/covid-19/covid-js.html
  // /*
  var cendata = L.esri.featureLayer({
    url: "https://services9.arcgis.com/6Hv9AANartyT7fJW/arcgis/rest/services/USCounties_cases_V1/FeatureServer/0",
    style: getStyle,
    onEachFeature: onEachFeature
  }).bindPopup(PopupCOVID).addTo(map);// Can add bindPopup with featureLayer
  // Set the default style for the polygons
  // Not sure why getStyle is called here for the second time.
  //   >> Comment out for the moment until I figure out.
  //cendata.setStyle(getStyle);
  // Set the default popup template
  //cendata.bindPopup(PopupCOVID);
  // */
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
function weatherWarnings(Layer,map) {
  // Long-Duration Hazards (e.g. Inland & Coastal Flooding/High Winds/High Seas)
  // https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  // From the Map Information: "dissolved polygon layers should be used when requesting a map image"
  var hazXML = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer/WMSServer";
  var hazLayers = {
    AirQuality: Layer.tileLayer.wms(hazXML, nowCOAST('2') ),
    Wildfire:   Layer.tileLayer.wms(hazXML, nowCOAST('5') ),
    ExtremeTemperature:Layer.tileLayer.wms(hazXML, nowCOAST('8') ),
    FreezingDroplets:  Layer.tileLayer.wms(hazXML, nowCOAST('11') ),
    //FreezingSprayMaritime:   Layer.tileLayer.wms(hazXML, nowCOAST('14') ),
    VisibilityLand:Layer.tileLayer.wms(hazXML, nowCOAST('17') ),
    //VisibilitySeas:Layer.tileLayer.wms(hazXML, nowCOAST('21') ),
    "Flooding":    Layer.tileLayer.wms(hazXML, nowCOAST('28,25') ),//25-Land,28-Coast
    BeachHazCoast: Layer.tileLayer.wms(hazXML, nowCOAST('32') ),
    //BeachHazOcean: Layer.tileLayer.wms(hazXML, nowCOAST('35') ),
    WindLand:   Layer.tileLayer.wms(hazXML, nowCOAST('39') )
    //WindSeas:  Layer.tileLayer.wms(hazXML, nowCOAST('42') )
  };
  Layer.control.layers({},hazLayers,{collapsed:false}).addTo(map);
  return hazLayers.Topography.addTo(map);
}
function nowCOAST(Nq) {
  return {
    layers: Nq,
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NOS/OCS nowCOAST, NOAA/NWS and NOAA/OAR/NSSL",
    opacity: 0.8,
    fillOpacity: 0.5
  }
}

function plotPolygon() {
  //https://blog-en.openalfa.com/how-to-read-json-files-in-javascript
  $.getJSON("./geo-counties-us.json", function(data) {
    //$.getJSON("https://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_050_00_20m.json", function(data) {
    L.geoJson(data,{
      style:function(feature){
        return {opacity:0.1,fillOpacity:0.05}
      }
    }).addTo(map);
  });
}

const OffCenter = (c,y,x) => [c[0]+y,c[1]+x];
// https://en.wikipedia.org/wiki/Great-circle_distance#Formulae
// https://mathworld.wolfram.com/GreatCircle.html
// Earth radii in kilometers 6371.0088 (km), given a spheric shape
const great_circle_distance_km = (p,M) => unit_great_circle_distance(p,M)*6371.0088;
const great_circle_distance_mi = (p,M) => km2mi( great_circle_distance_km(p,M) );
const unit_great_circle_distance = (p,M) => Math.acos( diffLatSine(p.Lat,M.Lat)+diffLatCosine(p.Lat,M.Lat)*Math.cos( d2r(p.Lon-M.Lon) ) );
const diffLatCosine = (c0,c) => Math.cos( d2r(c0) )*Math.cos( d2r(c) );
const diffLatSine   = (c0,c) => Math.sin( d2r(c0) )*Math.sin( d2r(c) );
const d2r = (d) => d*(3.141592653589793238462/180);
// Unit conversion of kilometers/miles 1.609344
const km2mi = (d) => d*1.609344;
const mi2km = (d) => d*0.62137119;
const mi2m  = (d) => mi2km(d)*1000;
