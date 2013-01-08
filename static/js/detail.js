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

    $('.rollback_place').click(function(e) {
        e.preventDefault();
        var revision_id = $(this).attr("data-revision");
        var url = $G.apiBase + place_geojson.properties.id + "/" + revision_id + ".json";
        var comment = prompt("Please add a comment / note about this change.");
        var data = {
            'comment': comment
        }
        var $xhr = $.ajax({
            'url': url,
            'data': JSON.stringify(data),
            'type': 'PUT',
            'dataType': 'json'
        }).success(function(data) {
            window.location.reload();
            //console.log(data);
        });
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

    $('.toggleNext').click(function(e) {
        e.preventDefault();
        $(this).next().toggle();
    });

    $('#addAlternateName').click(function(e) {
        e.preventDefault();
        var $tr = $('#alternateNamesTable tbody tr').eq(0).clone();
        $tr.find('input').val('');
        $('#alternateNamesTable tbody').append($tr.show());
    });

    $('.removeAltName').click(function() {
        $(this).closest('tr').remove();
    });

    //handle ajax-ifying edit / save
    //FIXME: this needs to be architected very differently
    var SAVE_URL = $G.apiBase + place_geojson.properties.id + ".json";
    //var SAVE_URL = "/1.0/place/" + place_geojson.properties.id + ".json";
    $('#editPlace').toggle(function(e) {
        e.preventDefault();
        $(this).text("Save");
        $('.commitMessage').show();
        //handle place name input
        var $placeName = $('#placeName');
        var currentPlaceName = $.trim($placeName.text());
        $placeName.data("oldVal", currentPlaceName);
        $placeName.empty();
        var $placeNameInput = $('<input />')
            .attr("id", "placeNameInput")
            .val(currentPlaceName)
            .appendTo($placeName);

        //make alternate names editable
        $('#alternateNamesTable input[disabled]').removeAttr("disabled");
        $('#timeframes input[disabled]').removeAttr("disabled");
        $('.removeAltName').show();
        $('#alternateNamesTable tfoot').show();

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
        place_geojson.comment = $('#comment').val();

        // get alternate names from input elements, perhaps re-factor into separate function
        var alternate_names = [];
        $('#alternateNamesTable tbody tr:visible').each(function() {
            var $this = $(this);
            alternate_names.push({
                'lang': $this.find('.alternateLang').val(),
                'name': $this.find('.alternateName').val()
            });
        });
        place_geojson.properties.alternate = alternate_names;

        //handle getting / saving time-frame data FIXME: validations
        if ($('#timeframe_start').val() != '') {
            var timeframe = {
                'start': $('#timeframe_start').val(),
                'start_range': $('#timeframe_start_range').val(),
                'end': $('#timeframe_end').val(),
                'end_range': $('#timeframe_end_range').val()
            }
            place_geojson.properties.timeframe = timeframe;
        }

        var $xhr = $.ajax({
            'url': SAVE_URL,
            'data': JSON.stringify(place_geojson),
            'type': 'PUT',
            'dataType': 'json'
        })
        .success(function(response) {
                //console.log(response);
                location.reload();
//                place_geojson = response;
//                $('#saveStatus').hide();
//                $btn.text("Edit").show();
//                $('#placeName').empty().text(place_geojson.properties.name);
//                $('#featureCodeInput').select2("destroy").remove();
//                var featureCodeString = place_geojson.properties.feature_code + ": " + place_geojson.properties.feature_code_name;
//                $('#featureCode').empty().text(featureCodeString);
                //TODO: in an ideal world, read the revisions JSON and update History.                
        })
        .fail(function(response) {
            alert("error saving");
            $('#saveStatus').text(response.error);
        });      

    });
    //END handle ajax edit /save.

    $('.tabButtons li a').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.hasClass("selectedTab")) {
            return;
        }
        if ($('.selectedTab').length > 0) {
            var displayedTab = $('.selectedTab').attr("href");
            $('.selectedTab').removeClass("selectedTab");
            $(displayedTab).hide();
        }

        $this.addClass("selectedTab");
        var idToDisplay = $this.attr("href");
        console.log(idToDisplay);
        $(idToDisplay).show();

    });

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

