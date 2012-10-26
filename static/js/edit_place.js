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

var API_URL = "/1.0/place/" + place_geojson.properties.id + ".json";

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
   
    
    $('#placeForm').submit(function(e) {
        e.preventDefault();
        var data = {
            'name': $('#placeName').val(),
            'feature_code': $('#featureCode').val()
        };
        $.extend(place_geojson.properties, data);
        $('#saveNotification').text("Saving...");
        var json = JSON.stringify(place_geojson);
        var $xhr = $.ajax({
            'url': API_URL,
            'data': json,
            'type': 'PUT',
            'dataType': 'json'
        })
        .success(function(response) {
                $('#saveNotification').text("Saved");
                console.log(response);
        })
        .fail(function(response) {
            alert("error saving");
            $('#saveNotification').text(response.error);
        });     
    });  
});
