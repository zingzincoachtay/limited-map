var map,L,markers;
var leafletmaplayer = 'map';
var origins = [
  {"c":[39.640784,-86.831823],"z":1000,"name":"Heartland Automotive"},
  {"c":[40.363639,-86.835809],"z":999,"name":"Heartland Automotive - Lafayette"}
];
var CirclesinMiles = [100,200,300,500,1000], inMeters = [];
CirclesinMiles.forEach((e) => inMeters.push(e/1.609344*1000));

function LiveLong(o) {
  Object.defineProperty(this, "mapjson", {
    set: function(o) {
      mapjson = o;
    },
    get: function() {
      return mapjson;
    },
    configurable: false
  });
}
function onMapClick(e){
  L.popup()
    .setLatLng(e.latlng)
    .setContent("Closest supplier is "+ e.latlng.toString())
    .openOn(map);
}
function DrawBaseMapLayer(Layer,map){
  return Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}
function placeOrigin(x,Layer,map){
  return Layer.marker(x.c,{
    "keyboard" : true,
    "title" : x.name,
    "zIndexOffset":x.z}).addTo(map);
}
function placeMarker(x,Layer,map){
  return Layer.marker([x.Latitude,x.Longitude],{
    "keyboard" : false,
    "title" : x.Supplier
  }).addTo(map);
}
function weatherLayer(phenom,L,map) {
  // I drew the data from U.S. Geological Survey.
  // https://nowcoast.noaa.gov/help/#!section=map-service-list
  // Go to Capability > Layer > Layer queryable="?" to find the layer name to parse.

  Clouds(L,map);
  if( /^warning$/i.test(phenom) ) weatherWarnings(L,map);
  if( /^hurricane$/i.test(phenom) ) hazardHurricane(L,map);
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

OffCenter = (c,y,x) => [c[0]+y,c[1]+x];
