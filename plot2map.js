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
  return Layer.marker(x.c,{
    "keyboard" : true,
    "title" : x.name,
    "zIndexOffset":x.z}).addTo(map);
}
function placeMarker(x,Layer,map){
  return Layer.marker(x.c,{
    "keyboard" : false,
    "title" : x.name
  }).addTo(map);
}
function onMapClick(e){
  if( typeof markers === 'undefined' ){
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked on "+ e.latlng.toString())
      .openOn(map);
  } else {
    var nearbyMarkers = distancesOf([e.latlng.lat,e.latlng.lng]);
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked near " + nearbyMarkers.name)
      .openOn(map);
  }
}
function distancesOf(origin){
  var BigD = [];
  markers.forEach((m, i) => {
    var LittleD = unit_great_circle_distance(
      {Lat:origin[0],Lon:origin[1]},
      {Lat:m.Latitude,Lon:m.Longitude}
    );
    BigD.push({name:m.Supplier,span:LittleD});
  });
  return nearby(BigD);
}
function nearby(d){
  var recent = d.pop();
  d.forEach((gcd, i) => {
    if(recent.span>gcd.span)  recent = gcd;
  });
  return recent;
}
function weatherLayer(phenom,L,map) {
  // I drew the data from U.S. Geological Survey.
  // https://nowcoast.noaa.gov/help/#!section=map-service-list
  // Go to Capability > Layer > Layer queryable="?" to find the layer name to parse.

  Clouds(L,map);
  if( /^warning$/i.test(phenom) ) weatherWarnings(L,map);
  if( /^hurricane$/i.test(phenom) ) hazardHurricane(L,map);
  if( /^covid$/i.test(phenom) ) hazardHurricane(L,map);
}
function Clouds(Layer,map) {
  // Recent Weather Radar Imagery
  // Updated every 5 seconds, lasting several hours?
  // Reference: https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  return Layer.tileLayer.wms("https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?", {
    layers: '1',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NOS/OCS nowCOAST, NOAA/NWS and NOAA/OAR/NSSL",
    opacity: 0.5
  }).addTo(map);
}
function hazardHurricane(Layer,map) {
  // Watches, Warnings, and Track/Intensity Forecasts
  // https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  return Layer.tileLayer.wms("https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer?", {
    layers: '1',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NOS/OCS nowCOAST, NOAA/NWS and NOAA/OAR/NSSL",
    opacity: 0.5
  }).addTo(map);
}
function weatherWarnings(Layer,map) {
  // Long-Duration Hazards (e.g. Inland & Coastal Flooding/High Winds/High Seas)
  // https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  return Layer.tileLayer.wms("https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer/WMSServer?", {
    layers: '1',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NOS/OCS nowCOAST, NOAA/NWS and NOAA/OAR/NSSL",
    opacity: 0.5
  }).addTo(map);
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
