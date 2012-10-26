'use strict';

var map, jsonLayer, similarPlacesLayer;

var geojsonDefaultCSS = {
    radius: 7,
    fillColor: "#7CA0C7",
    color: "#18385A",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.6
};

var geojsonHighlightedCSS = {
    radius: 7,
    fillColor: '#F15913',
    color: '#f00',
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var similarPlacesDefaultCSS = {
    radius: 6,
    fillColor: 'green',
    color: 'green',
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.5
};

var similarPlacesHighlightedCSS = {
    radius: 8,
    opacity: 1,
    weight: 1,
    fillOpacity: 1,
    color: '#000'
};

/*
var similarPlacesCSS = $.extend(geojsonDefaultCSS, {
    'opacity': 0.1,
    'fillOpacity': 0.1,
    'color': '#000'

});
*/
$(function() {
    
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © openstreetmap contributors';
    var osm = new L.TileLayer(osmUrl,{minZoom:1,maxZoom:18,attribution:osmAttrib});
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(34.11577, -93.855211), zoom: 4 });
    
    
    jsonLayer = L.geoJson(place_geojson, {
        'pointToLayer': function(feature, latlng) {
            return L.circleMarker(latlng, geojsonDefaultCSS);
        }
    }).addTo(map);

    similarPlacesLayer = L.geoJson(similar_geojson, {
        'onEachFeature': function(feature, layer) {
            feature.properties.highlighted = false;
            var id = feature.properties.id;
            var selector = '.similarPlace[data-id=' + id + ']';
            layer.on("mouseover", function(e) {
                $(selector).addClass("highlighted");
            });
            layer.on("mouseout", function(e) {
                $(selector).removeClass("highlighted");
            });
            layer.on("click", function(e) {
                var url = feature_url_prefix + feature.properties.id;
                location.href = url;
            });
        },
        'pointToLayer': function(feature, latlng) {
            return L.circleMarker(latlng, similarPlacesDefaultCSS);
        }        

    });

    $('.similarPlace').hover(function() {
        var $this = $(this);
        var id = $this.attr("data-id");
        console.log(id);
        var layer = getFeatureById(id, similarPlacesLayer);
        //console.log(layer);
        layer.feature.properties.highlighted = true;
        layer.bringToFront();
        similarPlacesLayer.setStyle(styleFunc);
    }, function() {
        var $this = $(this);
        var id = $this.attr("data-id");
        var layer = getFeatureById(id, similarPlacesLayer);
        layer.feature.properties.highlighted = false;
        similarPlacesLayer.setStyle(styleFunc);    
    });

    $('#showSimilar').toggle(function(e) {
        e.preventDefault();
        $(this).text("Hide Similar");
        $('#similarPlaces').slideDown();
        similarPlacesLayer.addTo(map);
    }, function(e) {
        e.preventDefault();
        $(this).text("Show Similar");
        $('#similarPlaces').slideUp();
        map.removeLayer(similarPlacesLayer);
    });

});


function styleFunc(feature) {
    switch (feature.properties.highlighted) {
        case true:
            return similarPlacesHighlightedCSS;
        case false:
            return similarPlacesDefaultCSS;
    } 
}

function getFeatureById(feature_id, layer) {
    //var ret = false;
    //console.log("Feature_id", feature_id);
    //var id = feature_id.replace("feature", "");
    var ret = false;
    layer.eachLayer(function(layer) {
        if (layer.feature.properties.id == feature_id) {
            ret = layer;
        }
    });
    return ret;
}

