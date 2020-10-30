L.Icon.Default.prototype.options.iconSize = [20,30];
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var inMiles = [100,200,300,500,1000], inMeters = [];
inMiles.forEach((e) => inMeters.push(e/1.609344*1000));

function onMapClick(e){
  L.popup()
    .setLatLng(e.latlng)
    .setContent("Closest supplier is "+ e.latlng.toString())
    .openOn(map);
}

function weatherLayer(phenom,L,map) {
  if( /^hurricane$/i.test(phenom) ) return hazardHurricane(L,map);
  if( /^hail|sleet$/i.test(phenom) ) return hazardHailSleet(L,map);
  if( /^rain|snow$/i.test(phenom) ) return Clouds(L,map);
}
function hazardHurricane(Layer,map) {
  // Instead, I drew the data from U.S. Geological Survey for the hazards data.
  // Understandably, the layers are named differently.
  // Go to Capability > Layer > Layer queryable="?" to find the layer name to parse.
  // Reference: https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  return Layer.tileLayer.wms("https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?", {
    layers: '1',
    format: 'image/png',
    transparent: true,
    attribution: "NOAA/NOS/OCS nowCOAST, NOAA/NWS and NOAA/OAR/NSSL",
    opacity: 0.4
  }).addTo(map);
}
function hazardHailSleet(Layer,map) {
}
function Clouds(Layer,map) {
  // Iowa State Univ Mesonet is good, but I want the hurricane data.
  /*
  return Layer.tileLayer.wms("https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi", {
    layers: 'nexrad-n0q',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
  }).addTo(map);
  */
}
