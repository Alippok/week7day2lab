


var Map = function(center, zoom){
  this.googleMap = new google.maps.Map( document.getElementById("map"), {
    center: center,
    zoom: zoom
  });
}




module.exports = Map;