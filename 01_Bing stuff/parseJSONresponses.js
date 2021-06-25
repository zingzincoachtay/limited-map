var apijson_t = 'far';
var apijson_provider = 'BINGMAP';
var apijson_tree = {
  'BINGMAP' : [
    ["point","coordinates"],
    ["travelDistance"],
    ["travelDuration"]
  ]
};
var errmsg = '';

function parseJSONs(s) {
  if(s.length==0)  ReadyToExport(['']);
  var t = (/\r?\n/.test(s)) ? s.split(/\r?\n/) : [s];
  var y = []; for (let o of t)  y.push( parseAPIJSON(o) );
  ReadyToExport(y);
}
function ReadyToExport(x) {
  document.getElementById(apijson_t).value = x.join("\n");
  // Excel will always paste from the copy (JSON string) from cell before the clipboard.
  // Good idea, no good use with Excel, however.
  document.getElementById(apijson_t).select();
  //document.execCommand("copy");
}
function parseAPIJSON(o) {
  if( /^BINGMAP$/.test(apijson_provider) ) return parseBingMapAPIJSON(o);
}
function parseBingMapAPIJSON(s) {
  if(s.length==0) return '';
  let BINGMAPAPIJSON = unstringify(s).resourceSets[0].resources[0];
  let sap = [];
  let woods = apijson_tree[apijson_provider];
  woods.forEach((tree, i) => {
    sap.push(
      ifkeythenvalue(tree,BINGMAPAPIJSON)
    );
  });
  let pastable = sap.filter((v) => v.length > 0);
  //next, return in list, so that both `pins` and `fars` can return and distinguishable
  return pastable.join("\t");
}
function ifkeythenvalue(nodes,o) {
  var depth = o;
  for(node of nodes){
    if( !(node in depth) ) return '';// Could not establish key-value pair
    depth = depth[node];
  }
  return (Array.isArray(depth)) ? depth.join("\t") : depth.toString();
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
    y.setAttribute("id",apijson_t);
    y.setAttribute("rows","10");
    y.setAttribute("cols","40");
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
