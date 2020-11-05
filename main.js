// http://zetcode.com/javascript/jsonurl/

var getJSON = function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };

    xhr.send();
};

function getJSONjQuery() {
  //https://blog-en.openalfa.com/how-to-read-json-files-in-javascript
  $.getJSON("./geo-counties-us.json", function(data) {
    //$.getJSON("https://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_050_00_20m.json", function(data) {
    L.geoJson(data,{
      style:function(feature){
        return {opacity:0.1,fillOpacity:0.05}
      }
    }).addTo(map);
  });
}
