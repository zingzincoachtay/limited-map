var bingmapapijson_t = 'far';

function parseCoordinates() {
  var pin = format_json("BINGMAPAPIJSON").resourceSets[0].resources[0].point.coordinates;
  var far = format_json("BINGMAPAPIJSON").resourceSets[0].resources[0].travelDistance;
  document.getElementById("err").innerHTML = pin;
  format_t('no parse');
  //if( !pin )  format_t(far);
  //if( !far )  format_t(pin[0]+"\t"+pin[1]);
  // Excel will always paste from the copy (JSON string) from cell before the clipboard.
  // Good idea, no good use with Excel, however.
  document.getElementById("far").select();
  document.execCommand("copy");
}
function parseDistance() {
  var far = format_json("BINGMAPAPIJSON").resourceSets[0].resources[0].travelDistance;
  document.getElementById("far").value = pin[0]+"\t"+pin[1];// Use text input to strip any formatting
  document.getElementById("far").value = far;// Use text input to strip any formatting
}
format_json = (db) => JSON.parse( document.getElementById(db).value );
format_t = (t) => document.getElementById(bingmapapijson_t).value = t;
// https://d3js.org
