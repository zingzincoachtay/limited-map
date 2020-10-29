var bingmapapijson_t = 'far';
var errmsg = '';
var url = '\\\\hagcsv005\\PURCHASING\\02 QUOTES\\MAPPABLE DATA.xlsx';

function LiveLong(o) {
  Object.defineProperty(this, "mapjson", {
    set: function(o) {
      mapjson = o;
    },
    get: function() {
      return mapjson;
    },
    configurable: false
  });
}
function saveMapGlobally(o) {
  mapdata = o;
}
function parseJSONs(s) {
  if(s.length==0)  ReadyToExport(['']);
  var t = (/\r?\n/.test(s)) ? s.split(/\r?\n/) : [s];
  var y = []; for (let i in t)  y.push( parseBingMapAPIJSON(t[i]) );
  document.getElementById("gErr").innerHTML = s.length;
  ReadyToExport(y);
}
function ReadyToExport(x) {
  document.getElementById(bingmapapijson_t).value = x.join("\n");
  // Excel will always paste from the copy (JSON string) from cell before the clipboard.
  // Good idea, no good use with Excel, however.
  document.getElementById(bingmapapijson_t).select();
  //document.execCommand("copy");
}
function parseBingMapAPIJSON(s) {
  if(s.length==0) return '';
  let BINGMAPAPIJSON = unstringify(s).resourceSets[0].resources[0];
  let pin = (typeof BINGMAPAPIJSON.point !== 'undefined') ? BINGMAPAPIJSON.point.coordinates : '';
  let far = (typeof BINGMAPAPIJSON.travelDistance !== 'undefined') ? BINGMAPAPIJSON.travelDistance : '';
  //next, return in list, so that both `pins` and `fars` can return and distinguishable
  return (pin.length>0) ? pin : (far>0) ? far : '';
}
var makeBox = {
  Ans : function (){
    const y = document.createElement("INPUT");
    y.setAttribute("type","text");
    y.setAttribute("id","final");
    y.setAttribute("tabindex",2);
    y.setAttribute("defaultValue","");
    document.body.appendChild(y);
  },
  NAns : function (){
    const y = document.createElement("TEXTAREA");
    y.setAttribute("id",bingmapapijson_t);
    y.setAttribute("rows","10");
    y.setAttribute("cols","20");
    document.body.appendChild(y);
  },
  NPinsAns : function (){
    const y = document.createElement("TEXTAREA");
    y.setAttribute("id","pins");
    y.setAttribute("rows","10");
    y.setAttribute("cols","20");
    document.body.appendChild(y);
  },
  NFarsAns : function (){
    const y = document.createElement("TEXTAREA");
    y.setAttribute("id","fars");
    y.setAttribute("rows","10");
    y.setAttribute("cols","20");
    document.body.appendChild(y);
  },
  DefaultTarget : function (){
    const y = document.createElement("INPUT");
    y.setAttribute("type","text");
    y.setAttribute("id","target");
    y.setAttribute("defaultValue",url);
    document.body.appendChild(y);
  },

};
unstringify = (s) => JSON.parse(s);
format_json = (db) => JSON.parse( document.getElementById(db).value );
format_t = (t) => document.getElementById(bingmapapijson_t).value = t;
