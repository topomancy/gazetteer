'use strict';

var map, jsonLayer;

var geojsonDefaultCSS = {
    radius: 7,
    fillColor: "#7CA0C7",
    color: "#18385A",
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.5
};

var geojsonHighlightedCSS = {
    radius: 7,
    fillColor: '#F15913',
    color: '#f00',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.6
};


$(function() {
    
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © openstreetmap contributors';
    var osm = new L.TileLayer(osmUrl,{minZoom:1,maxZoom:18,attribution:osmAttrib});
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(34.11577, -93.855211), zoom: 4 });
    
    
    jsonLayer = L.geoJson(place_geojson, {
 
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geojsonDefaultCSS);
        }

    }).addTo(map);

    jsonLayer.addData(place_geojson);
     
});
