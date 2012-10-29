'use strict';

var map, jsonLayer, similarPlacesLayer;

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
            return L.circleMarker(latlng, GAZ_STYLES.geojsonHighlightedCSS);
        }
    }).addTo(map);
    var bounds = jsonLayer.getBounds();
    map.fitBounds(bounds);

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
            return L.circleMarker(latlng, GAZ_STYLES.similarPlacesDefaultCSS);
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
        similarPlacesLayer.addTo(map).bringToBack();
        var bounds = similarPlacesLayer.getBounds();
        map.fitBounds(bounds);
    }, function(e) {
        e.preventDefault();
        $(this).text("Show Similar");
        $('#similarPlaces').slideUp();
        map.removeLayer(similarPlacesLayer);
        var bounds = jsonLayer.getBounds();
        map.fitBounds(bounds);
    });

    $('#showHistory').toggle(function(e) {
        e.preventDefault();
        $(this).text("Hide History");
        $('#revisions').slideDown();
    }, function(e) {
        e.preventDefault();
        $(this).text("Show History");
        $('#revisions').slideUp();
    });

    $('.collapseChild').click(function() {
        $(this).parent().find('ul').toggle();
    });

});


function styleFunc(feature) {
    switch (feature.properties.highlighted) {
        case true:
            return GAZ_STYLES.similarPlacesHighlightedCSS;
        case false:
            return GAZ_STYLES.similarPlacesDefaultCSS;
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

