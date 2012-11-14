'use strict';

var map, jsonLayer, similarPlacesLayer;

$(function() {
    
//    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//    var osmAttrib='Map data © openstreetmap contributors';
    var osm = new L.TileLayer($G.osmUrl,{minZoom:1,maxZoom:18,attribution:$G.osmAttrib});
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(34.11577, -93.855211), zoom: 4 });
    
    
    jsonLayer = L.geoJson(place_geojson, {
        'pointToLayer': function(feature, latlng) {
            return L.circleMarker(latlng, $G.styles.geojsonHighlightedCSS);
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
            return L.circleMarker(latlng, $G.styles.similarPlacesDefaultCSS);
        }        

    });

    $('.similarPlace').hover(function() {
        var $this = $(this);
        var id = $this.attr("data-id");
        //console.log(id);
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
    $('#showAlternateNames').click(function(e) {
        e.preventDefault();
        $('#alternateNamesTable').toggle();
    });

    $('.collapseChild').click(function() {
        $(this).parent().find('ul').toggle();
    });


    //handle ajax-ifying edit / save
    //FIXME: this needs to be architected very differently
    var SAVE_URL = $G.apiBase + place_geojson.properties.id + ".json";
    //var SAVE_URL = "/1.0/place/" + place_geojson.properties.id + ".json";
    $('#editPlace').toggle(function(e) {
        e.preventDefault();
        $(this).text("Save");

        //handle place name input
        var $placeName = $('#placeName');
        var currentPlaceName = $.trim($placeName.text());
        $placeName.data("oldVal", currentPlaceName);
        $placeName.empty();
        var $placeNameInput = $('<input />')
            .attr("id", "placeNameInput")
            .val(currentPlaceName)
            .appendTo($placeName);

        //handle feature code input with select2 autocomplete
        var featureCode = place_geojson.properties.feature_code;
        var featureCodeName = place_geojson.properties.feature_code_name;
        //console.log(featureCode);
        var $featureCode = $('#featureCode').empty();         
        var $featureCodeInput = $('<input />')
            .attr("id", "featureCodeInput")
            .val(featureCode)
            .width(300)
            .appendTo($featureCode);
            
        $featureCodeInput.select2({
            ajax: {
                'url': $G.apiBase + "feature_codes.json",
                dataType: 'json',
                quietMillis: 100,
                data: function(term, page) {
                    return {
                        q: term,
                        page_limit: 10,
                        page: page
                    }
                },
                results: function(data, page) {
                    var more = data.has_next;
                    return {results: data.items, more: more};
                }
            },
            formatResult: function(item) {
                return "<div>" + item.cls + ":" + item.typ + " " + item.name + "<div style='font-size:12px'><i>" + item.description + "</i></div></div>"
            },
            formatSelection: function(item) {
                place_geojson.properties.feature_code_name = item.name; //FIXME: please look through select2 docs and move to an onSelect type callback, but this works for now.
                return item.typ + ": " + item.name;           
                //return "<div data-id='" + item.id + "'>" + item.first_name + " " + item.last_name + "</div>";
            },
            initSelection: function(elem, callback) {
                var val = $(elem).val();
                var data = {
                    'id': val,
                    'typ': val,
                    'name': featureCodeName
                };
                callback(data); 
            }
        });
                    
    }, function(e) {
        e.preventDefault();
        var $btn = $(this);
        $btn.hide();
        $('#saveStatus').text("Saving...");
        place_geojson.properties.feature_code = $('#featureCodeInput').val();        
        place_geojson.properties.name = $('#placeNameInput').val();
        var $xhr = $.ajax({
            'url': SAVE_URL,
            'data': JSON.stringify(place_geojson),
            'type': 'PUT',
            'dataType': 'json'
        })
        .success(function(response) {
                //console.log(response);
                place_geojson = response;
                $('#saveStatus').hide();
                $btn.text("Edit").show();
                $('#placeName').empty().text(place_geojson.properties.name);
                $('#featureCodeInput').select2("destroy").remove();
                var featureCodeString = place_geojson.properties.feature_code + ": " + place_geojson.properties.feature_code_name;
                $('#featureCode').empty().text(featureCodeString);
                //TODO: in an ideal world, read the revisions JSON and update History.                
        })
        .fail(function(response) {
            alert("error saving");
            $('#saveStatus').text(response.error);
        });      

    });
    //END handle ajax edit /save.

});


function styleFunc(feature) {
    switch (feature.properties.highlighted) {
        case true:
            return $G.styles.similarPlacesHighlightedCSS;
        case false:
            return $G.styles.similarPlacesDefaultCSS;
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

