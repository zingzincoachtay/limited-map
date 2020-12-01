var markers,sources;
var POI=new Set(), BOM=new Set();//

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
function onMarkerClick(e){
  document.getElementById("err").innerHTML += '<BR>'+e.target._popup._content;
  document.getElementById("err").innerHTML += '<BR>'+JSON.stringify([e.latlng.lat,e.latlng.lng]);
  $('#search').val( JSON.stringify([e.latlng.lat,e.latlng.lng]) );
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
  return closest(distances);
}
function closest(prox){
  var close = prox.pop();
  if( prox.length == prox.filter( d=>equidistant(d.span,close.span) ).length ) return close;
  var closer = prox.filter( d=>shorter(d.span,close.span) );
  return (closer.length==0) ? close : closest(closer);
}
const equidistant = (d1,d2) => (d1==d2) ? true : false;
const shorter = (d1,d2) => (d1<d2) ? true : false;

function addOption(v,t){
  var val = JSON.stringify(v);
  return $("<OPTION>").val(val).text(t);
}

const basicMarkerInfo = (company1,address1,city1,state1,zip1,country1,driving1,dtime1) => `
Company\t${company1}
Address\t${address1}
\t${city1}, ${state1} ${zip1}
\t${country1}

Distance\t${driving1} mile(s)
Driving Time\t${dtime1}
`;

// Use with Array.prototype.filter
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
const undupe = (value, index, self) => self.indexOf(value) === index;
const setCOVIDmap = (N) => sn_val = (N==3) ? "FatalityRa" : (N==2) ? "Deaths" : "Confirmed";
