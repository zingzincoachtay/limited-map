var markers,sources,connect;
var selectlayers = {};
var SYNC=[], POI=[], BOM=[];//, IQ=[];

function onMapClick(e){
  let content = '';
  if( typeof markers === 'undefined' )
    content = "Clicked on " + `(${e.latlng.lat.toString()},${e.latlng.lng.toString()})`;
    //content = "Clicked on " + e.latlng.toString();
  else {
    let nearbyMarkers = nearby([e.latlng.lat,e.latlng.lng]);
    content = "Clicked near " + nearbyMarkers[0].name
  }
  L.popup()
    .setLatLng(e.latlng)
    .setContent(content)
    .openOn(map);
}
function onMarkerClick(e){
  // Allow synchronization between the map marker and the SELECT box
  //
  // .toString() ensures the compatibility with the values parsed from Spreadsheet
  //console.log( Object.getOwnPropertyNames(e).map((v)=>`${v} -- ${e[v]}`) );
  //console.log( Object.getOwnPropertyNames(e.target.options).map((v)=>`${v} -- ${e.target.options[v]}`) );
  //console.log( e.target.options.value );
  $('#search').val( e.target.options.value ).change();
}
// Leaflet also has the built-in `distanceTo(<LatLng> otherLatLng)` methods
// to `L.latLng` object
const nearby = (origin) => closest(
    markers.map(m=>({
      "name":m.POI,
      "D":L.latLng({lat:origin[0],lng:origin[1]}).distanceTo(L.latLng({lat:m.Latitude,lng:m.Longitude}))
    }))
);
function closest(distances){
  if(typeof distances === 'undefined')  return 0;
  let close  = distances[0] || [];
  let closer = distances.filter( d=>(d.D<close.D) );
  return (closer.length==0) ? distances.filter( d=>(d.D==close.D) ) : closest(closer);
}

const mappable = function(db,ID,index,info) {
  if( typeof db[ID] === 'undefined' )  db[ID] = {};
  db[ID][index] = info;
  return db;
}
// Use with Array.prototype.filter
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
const undupe = (value, index, self) => self.indexOf(value) === index;
const setCOVIDmap = (N) => sn_val = (N==3) ? "FatalityRa" : (N==2) ? "Deaths" : "Confirmed";
