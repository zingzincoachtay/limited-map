var mapdata = [];//will take JSON format for D3js
var url = "\\hagcsv005\PURCHASING\02 QUOTES\MAPPABLE DATA.xlsx";

function map(){
  var s = stringifyWB(url);
  document.getElementById("err").innerHTML = (typeof s);
}
function fetchWB(u){}
function stringifyWB(u){
  /* set up async GET request */
  var wb = new XMLHttpRequest();
  wb.open("GET", url, true);
  wb.responseType = "arraybuffer";

  wb.onload = function(e) {
    var data = new Uint8Array(wb.response);
    var workbook = XLSX.read(data, {type:"array"});

    var mapdata = XLSX.utils.sheet_to_json(workbook.Sheets["DB"]);
  }
  return mapdata;
}
