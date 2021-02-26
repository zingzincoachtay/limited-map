var markers,sourcing;

function onMapClick(e){
  if( typeof markers === 'undefined' ){
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked on "+ e.latlng.toString())
      .openOn(map);
  } else {
    //var nearbyMarkers = distancesOf([e.latlng.lat,e.latlng.lng]);
    var nearbyMarkers = nearby([e.latlng.lat,e.latlng.lng]);
    L.popup()
      .setLatLng(e.latlng)
      .setContent("Clicked near " + nearbyMarkers.name)
      .openOn(map);
  }
}
//Array.prototype.toAdd2 = (v,callback) => (typeof exists(v,this,callback)==='undefined') ? true : false;
const toAdd = (v,o,callback) => (typeof exists(v,o,callback)==='undefined') ? true : false;
const exists = (v,o,callback) => o.find( item=>callback(item,v) );
function distancesOf(origin){
  var BigD = [];
  for(m of markers){
    if( BigD.includes(m.POI) ) continue;
    var LittleD = unit_great_circle_distance(
      {Lat:origin[0],Lon:origin[1]},
      {Lat:m.Latitude,Lon:m.Longitude}
    );
    if( toAdd(LittleD,BigD, (it,v)=>it.span<v ) )
      BigD.push({name:m.POI,span:LittleD});
  }
  return [...new Set(BigD)];
}
function nearby(origin){
  var distances = distancesOf(origin);
  var closer = distances.pop();
  distances.forEach((it, i) => {
    closer = (closer.span>it.span) ? it : closer;
  });
  return closer;
}

function addOption(t){
  var op = document.createElement("option");
  op.text = t;
  return op;
}
//const addOption = (t,selected) => document.createElement("option").text = t;

// Use with Array.prototype.filter
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
const undupe = (value, index, self) => self.indexOf(value) === index;
const setCOVIDmap = (N) => sn_val = (N==3) ? "FatalityRa" : (N==2) ? "Deaths" : "Confirmed";
