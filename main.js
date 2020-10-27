var bingmapapijson_t = 'far';

function parseBingMapAPIJSON() {
  let BINGMAPAPIJSON = format_json("BINGMAPAPIJSON").resourceSets[0].resources[0];
  let pin = BINGMAPAPIJSON.point.coordinates;
  let far = BINGMAPAPIJSON.travelDistance;
  document.getElementById("err").innerHTML = pin;
  format_t('no parse');
  //if( !pin )  format_t(far);
  //if( !far )  format_t(pin[0]+"\t"+pin[1]);
  // Excel will always paste from the copy (JSON string) from cell before the clipboard.
  // Good idea, no good use with Excel, however.
  document.getElementById(bingmapapijson_t).select();
  document.execCommand("copy");
}
//function parseDistance() {
  //var far = format_json("BINGMAPAPIJSON").resourceSets[0].resources[0].travelDistance;
  //document.getElementById("far").value = pin[0]+"\t"+pin[1];// Use text input to strip any formatting
  //document.getElementById("far").value = far;// Use text input to strip any formatting
//}
format_json = (db) => JSON.parse( document.getElementById(db).value );
format_t = (t) => document.getElementById(bingmapapijson_t).value = t;
// https://d3js.org
