var markers,sources,central;
var POI=[], SYNC=[], IQ=[];
var BOM=[];

function onMapClick(e){
  if( typeof markers === 'undefined' ){
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked on "+ e.latlng.toString())
      .openOn(map);
  } else {
    var nearbyMarkers = nearby([e.latlng.lat,e.latlng.lng]);
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked near " + nearbyMarkers[0].name)
      .openOn(map);
  }
}
function onMarkerClick(e){
  // Allow synchronization between the map marker and the SELECT box
  //
  // .toString() ensures the compatibility with the values parsed from Spreadsheet
  $('#search').val( JSON.stringify([e.latlng.lat.toString(),e.latlng.lng.toString()]) );
  return regurgitate();
}
//Array.prototype.toAdd2 = (v,callback) => (typeof exists(v,this,callback)==='undefined') ? true : false;
const toAdd = (v,o,callback) => (typeof exists(v,o,callback)==='undefined') ? true : false;
const exists = (v,o,callback) => o.find( item=>callback(item,v) );
// Leaflet also has the built-in `distanceTo(<LatLng> otherLatLng)` methods
// to `L.latLng` object
function nearby(origin){
  var distances = markers.map(m=>{
    return {name:m.POI,D:map.distance(
      L.latLng({lat:origin[0],lng:origin[1]}),
      L.latLng({lat:m.Latitude,lng:m.Longitude})
    )}
  });
  return closest([...new Set(distances)]);
}
function closest(prox){
  var close = prox.pop();
  if( prox.length == prox.filter( d=>equidistant(d.D,close.D) ).length ) return [close,...prox];
  var closer = prox.filter( d=>shorter(d.D,close.D) );
  return (closer.length==0) ? close : closest(closer);
}
const equidistant = (d1,d2) => (d1==d2) ? true : false;
const shorter = (d1,d2) => (d1<d2) ? true : false;

function seekInList(BigL,key,val,ret){
  for(let tinyL of BigL)
    if(tinyL[key]=val) return tinyL[ret];
}

const basicMarkerInfo = (company1,address1,city1,state1,zip1,country1) => `
Company\t${company1}
Address\t${address1}
\t${city1}, ${state1} ${zip1}
\t${country1}
`;
const basicDriveInfo = (dest1,driving1,dtime1) => `
To:${dest1}
\tDistance\t${driving1} mile(s)
\tDriving Time\t${dtime1}
`;

// Use with Array.prototype.filter
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
const undupe = (value, index, self) => self.indexOf(value) === index;
const setCOVIDmap = (N) => sn_val = (N==3) ? "FatalityRa" : (N==2) ? "Deaths" : "Confirmed";
