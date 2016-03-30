


var Map = function(center, zoom){
  this.googleMap = new google.maps.Map( document.getElementById("map"), {
    center: center,
    zoom: zoom
  });

  this.addMarker = function( latlng, title){
    var marker = new google.maps.Marker({
      position: latlng,
      map: this.googleMap,
      title: title
    });
    return marker;
  }

  // this.bindClick = function(){
  //   google.maps.event.addListener(this.googleMap, "click", function(event){
  //     this.addmarker(event.latLng)
  //   }.bind(this))
  // };
    
}




module.exports = Map;