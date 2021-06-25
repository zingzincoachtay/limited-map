var markers,sources,connect;
var selectlayers = {};
var SYNC=[], POI=[], BOM=[];//, IQ=[];

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
  let close  = distances[0] || {"name":"empty set-no candidate","D":0};
  let closer = distances.filter( d=>(d.D<close.D) );
  return (closer.length==0) ? distances.filter( d=>(d.D==close.D) ) : closest(closer);
}

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
  decorate(e.target.options.value,Object.keys(selectlayers).filter((p)=>p!=e.target.options.value));
  return 1;
}
function decorate(solid,opaque){
  for(let oth of opaque)  selectlayers[oth].eachLayer(layer=>layer.setOpacity(0.15));
  for(let oth of opaque)  selectlayers[oth].bringToBack();
  selectlayers[solid].openPopup();
  selectlayers[solid].eachLayer((layer)=>layer.setOpacity(1.00));
  selectlayers[solid].bringToFront();// `bringToFront` for featureGroup
}
function resetmarkerselection(){
  for(let solid of Object.keys(selectlayers))  selectlayers[solid].eachLayer(layer=>layer.setOpacity(1));
  for(let solid of Object.keys(selectlayers))  selectlayers[solid].eachLayer(layer=>layer.closePopup( ));
  for(let solid of Object.keys(selectlayers))  selectlayers[solid].eachLayer(layer=>layer.closeTooltip( ));// sometimes needs this
}

const mappable = function(db,ID,index,info) {
  if( typeof db[ID] === 'undefined' )  db[ID] = {};
  db[ID][index] = info;
  return db;
}

function regurgitate(){
  //document.getElementById("err").innerHTML += '<BR>'+$('#search option:selected').text();
  //$("div#err").html
  let t = $(`#${profilerAttr.search.id} option:selected`).val();
  let basicInfo = {};
  // SELECT OPTIONS by two-way synchronization
  for(let a of markers.filter(m=>m.ID==t)){
      if(typeof basicInfo[`${a.City}${a.Zip}`]               === 'undefined')
        basicInfo[`${a.City}${a.Zip}`] = {[basicProfilerDisplay[0]]:basicMarkerInfo(a)};
      if(typeof basicInfo[`${a.City}${a.Zip}`][`${a.Plant}`] === 'undefined')
        basicInfo[`${a.City}${a.Zip}`][`${a.Plant}`] = basicDriveInfo(a);
  }
  for(let i of Object.keys(basicInfo)){
      basicInfo[i].info += basicProfilerDisplay.slice(1).map((p)=>basicInfo[i][p]||'').join('');
      for(let unknown of Object.keys(basicInfo[i]).filter((p)=>!basicProfilerDisplay.includes(p)).sort())
          basicInfo[i].info += basicInfo[i][unknown];
  }
  $(`#${profilerAttr.basicinfo.id}`).val( Object.keys(basicInfo).map((i)=>basicInfo[i].info).join() );

  let itemsInfo = ["\nParts\t\t\tUnit Price"];
  $(`#${profilerAttr.basicitem.id}`).val( itemsInfo.concat(sources.filter(s=>s.ID==t).map( (p)=>`${p["Item Number"]}\t\t$ `+(p["Price"]*1).toFixed(4) )).join("\n") );

  if(t == resetmarkercode)  resetmarkerselection();
  else  decorate(t,Object.keys(selectlayers).filter((p)=>p!=t));
  return 1;
}

// Use with Array.prototype.filter
//https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
const undupe = (value, index, self) => self.indexOf(value) === index;
const setCOVIDmap = (N) => sn_val = (N==3) ? "FatalityRa" : (N==2) ? "Deaths" : "Confirmed";
