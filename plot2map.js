var L,map;
//var leafletmaplayer = 'map';

const DrawBaseMapLayer = (Layer,map) => Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
const placeMarker = function(x,Layer,map,iconSize,customOpts){//&reg; &copy;
  Layer.Icon.Default.prototype.options.iconSize = iconSize;
  let names = {"hovertooltipbutnohtml":x.base,"openpopupandhtml":x.name};
  var p = Layer.marker(x.c,Object.assign({
    "title" : names.hovertooltipbutnohtml, // enable a mouseover popup
    "value" : x.ID,
    "keyboard" : false
  },customOpts));//.addTo(map);
  //return p.bindPopup(x.name+"<BR>",{autoClose:false});
  //return p.bindPopup(x.name+"<BR>",{autoClose:false}).openPopup();
  return p.bindPopup(names.openpopupandhtml,{closeOnClick:false,autoPan:false,autoClose:false}).on('click', onMarkerClick);
}
function hazardLayers(L,map) {
  // Pulling data from NOAA and USGS
  // https://viewer.nationalmap.gov/services/
  // https://www.weather.gov/gis/WebServices
  // https://nowcoast.noaa.gov/help/#!section=map-service-list
  // Go to Capability > Layer > Layer > Name to find the layer name to parse.
  var hazLayers = Object.assign(
    Clouds(L,map)
    ,hazardHurricane(L,map)
    ,weatherWarnings(L,map)
    ,epidemicCOVID(L,map)
  );
  return L.control.layers({},hazLayers,{collapsed:true,hideSingleBase:false,autoZIndex:false,position:"bottomleft"}).addTo(map);
}
const Clouds = (Layer,map,hazXML="https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer") => ({
    "Clouds" : Layer.tileLayer.wms(hazXML, nowCOAST('1') )
});
function Clouds2(Layer,map) {
  // Recent Weather Radar Imagery
  // Updated every 5 seconds, lasting several hours?
  // Reference: https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer?request=GetCapabilities&service=WMS
  var hazXML = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer";
  return Layer.tileLayer.wms(hazXML, nowCOAST('1') ).addTo(map);
}
const hazardHurricane = (Layer,map,hazXML="https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/WMSServer") => ({
    //SurfaceWindSwath:   Layer.tileLayer.wms(hazXML, nowCOAST('2') ),
    //ForecastWindExtent: Layer.tileLayer.wms(hazXML, nowCOAST('7') ),
    "Observed-Track and Eye": Layer.tileLayer.wms(hazXML, nowCOAST('4,3') ),
    "Forecast-Track, Eye and Cone": Layer.tileLayer.wms(hazXML, nowCOAST('9,8,6') ),
    "Siren Zone": Layer.tileLayer.wms(hazXML, nowCOAST('10') )
});
function hazardHurricane2(Layer,map) {
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
function weatherWarnings(Layer,map) {
  var hazXML = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer/WMSServer";
  return {
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
}
function weatherWarnings2(Layer,map) {
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

// https://en.wikipedia.org/wiki/Great-circle_distance#Formulae
// https://mathworld.wolfram.com/GreatCircle.html
// Earth radii in kilometers 6371.0088 (km), given a spheric shape
const great_circle_distance_km = (p,M) => unit_great_circle_distance(p,M)*6371.0088;
const great_circle_distance_mi = (p,M) => km2mi( great_circle_distance_km(p,M) );
const unit_great_circle_distance = (p,M) => Math.acos( diffLatSine(p.lat,M.lat)+diffLatCosine(p.lat,M.lat)*Math.cos( d2r(p.lng-M.lng) ) );
const diffLatCosine = (c0,c) => Math.cos( d2r(c0) )*Math.cos( d2r(c) );
const diffLatSine   = (c0,c) => Math.sin( d2r(c0) )*Math.sin( d2r(c) );
const d2r = (d) => d*(3.141592653589793238462/180);
// Unit conversion of kilometers/miles 1.609344
const km2mi = (d) => d*1.609344;
const mi2km = (d) => d*0.62137119;
const mi2m  = (d) => mi2km(d)*1000;
