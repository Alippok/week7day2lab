


var Map = function(center, zoom){
  this.googleMap = new google.maps.Map( document.getElementById("map"), {
    center: center,
    zoom: zoom
  });

  this.updateMap = function( center, zoom){
    this.googleMap.panTo(center),
    this.googleMap.setZoom(zoom)
  }

  this.addMarker = function( latlng, title){
    var marker = new google.maps.Marker({
      position: latlng,
      map: this.googleMap,
      title: title
    });
    return marker;
  }

  this.bindClick = function(){
    google.maps.event.addListener(this.googleMap, "click", function(event){
      this.addMarker(event.latLng)
    }.bind(this))
  };


    
}




module.exports = Map;