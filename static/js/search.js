'use strict';

var map, jsonLayer;

var feature_url_prefix = "/feature/";

$(function() {
    $('.mapListSection').css({'opacity': 0});
    $('#jsonLink').hide();
//    $('#updateSearch')
//        .click(function() {
//            $('#searchForm').submit();
//        })
//        .hide();
    
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © openstreetmap contributors';
    var osm = new L.TileLayer(osmUrl,{minZoom:1,maxZoom:18,attribution:osmAttrib});
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(34.11577, -93.855211), zoom: 4 });

    //update search when map viewport changes
    map.on("viewreset moveend", function(e) {
        var bboxString = map.getBounds().toBBoxString();
        //console.log(bboxString);
        setTimeout(function() {
            var newBboxString = map.getBounds().toBBoxString();
            if (bboxString === newBboxString) {
                $('#searchForm').submit();
            }
        }, 250);
    });
    
    jsonLayer = L.geoJson(null, {
        onEachFeature: function(feature, layer) {
            feature.properties.highlighted = false;
            var id = feature.properties.id;
            layer.on("mouseover", function(e) {
                var $row = $('#feature' + id);
                $row.addClass('highlighted');
            });
            layer.on("mouseout", function(e) {
                var $row = $('#feature' + id);
                $row.removeClass("highlighted");
            });
            layer.on("click", function(e) {
                var url = feature_url_prefix + feature.properties.id;
                location.href = url;
            });
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, GAZ_STYLES.geojsonDefaultCSS);
        }

    }).addTo(map);

    $('#searchForm').submit(function(e) {
        e.preventDefault();
        var bbox = map.getBounds().toBBoxString();
        var search_term = $('#searchField').val();
        if ($.trim(search_term) === '') return;
        location.hash = search_term;
        jsonLayer.clearLayers();
        $('#searchField').addClass("loading");
        $('#searchTerm').text(search_term);
        $('#searchField').attr("disabled", "disabled");
        $('#searchButton').attr("disabled", "disabled");
        $('#mapList tbody').empty();
        $('#currPageNo').text('*');
        var url = "/1.0/place/search.json?" + 'bbox=' + bbox + '&q=' + search_term + '&srid=' + '4326' + '&count=20&page=' + $('#page_no').val();
        $('#jsonLink').attr("href", url); 
        $.getJSON("/1.0/place/search.json", {
            'bbox': bbox,
            'q': search_term,
            'srid': 4326,
            'threshold': 0.5,
            'count': 20,
            'page': $('#page_no').val()
            }, function(features) {
            if ($('.mapListSection').css("opacity") == '0') {
                $('.mapListSection').animate({'opacity': '1'}, 1000);
                $('#jsonLink').show();
                //$('#updateSearch').show();
            }
            if (features.hasOwnProperty("error") && features.error != '') {
                alert(features.error);
                return;
            }
            
            $('#noOfResults').text(features.total);
            //$('#currPageNo').text(features.current_page);
            //$('#totalPages').text(features.pages);
            if (features.total === 0) {
                $('#currPageNo').text('0');
                $('#totalPages').text('0');                
            }
            $('#searchField').removeAttr("disabled");
            $('#searchField').removeClass("loading");
            $('#searchButton').removeAttr("disabled");
            jsonLayer.addData(features);
            for (var i=0; i<features.features.length;i++) {
                var f = features.features[i];
                var props = f.properties;
                var listItem = getRow(props);
                $('#mapList tbody').append(listItem);
            }         
        });
    });

    if ($.trim(location.hash) !== '') {
        $('#searchField').val(location.hash.replace("#", ""));
        $('#searchForm').submit();
    }
    /* pagination code */
    $('.first').click(function() {
        $('#page_no').val('1');
        $('#searchForm').submit();
    });

    $('.last').click(function() {
        var lastPage = parseInt($('#totalPages').text());
        $('#page_no').val(lastPage);
        $('#searchForm').submit();
    });

    $('.next').click(function() {
        var currPage = parseInt($('#page_no').val());
        var lastPage = parseInt($('#totalPages').text());
        if (currPage < lastPage) {
            $('#page_no').val(currPage + 1);
            $('#searchForm').submit();
        }
    });

    $('.previous').click(function() {
        var currPage = parseInt($('#page_no').val());
        if (currPage > 1) {
            $('#page_no').val(currPage - 1);
            $('#searchForm').submit();            
        }
    });
    /* pagination code end */

    $(window).resize(function() {
        var $tbody = $('#mapList tbody');
        var topOffset = $tbody.offset().top;
        var footerHeight = 40;
        var viewportHeight = $(window).height();
        $tbody.height(viewportHeight - (topOffset + footerHeight));
    });
    $(window).resize();

});



function getRow(props) {
    var $tr = $('<tr />').attr("id", "feature" + props.id).data("id", props.id).data("properties", props).hover(function() {
        var id = $(this).attr("id");
        id = id.replace("feature", "");
        var layer = getFeatureById(id);
        layer.feature.properties.highlighted = true;
        jsonLayer.setStyle(styleFunc);
        layer.bringToFront();
        //layer.feature.properties.highlighted = true;
    }, function() {
        var id = $(this).attr("id");
        id = id.replace("feature", "");
        var layer = getFeatureById(id);
        layer.feature.properties.highlighted = false;
        jsonLayer.setStyle(styleFunc);            
    });
    var $one = $('<td />').addClass("col1").appendTo($tr);
    var $a = $('<a />').attr("href", feature_url_prefix + props.id).text(props.name).appendTo($one);
//    var $a2 = $('<a />').addClass("viewSimilar").attr("target", "_blank").attr("href", "/search_related?id=" + props.id).text("view similar").appendTo($one);
    $('<td />').addClass("col2").text(props.feature_code_name).appendTo($tr);
//    $('<td />').text(props.admin2).appendTo($tr);
//    $('<td />').text(props.admin1).appendTo($tr);
    return $tr;     
}


function getFeatureById(feature_id) {
    //var ret = false;
    //console.log("Feature_id", feature_id);
    //var id = feature_id.replace("feature", "");
    var ret = false;
    jsonLayer.eachLayer(function(layer) {
        if (layer.feature.properties.id == feature_id) {
            ret = layer;
        }
    });
    return ret;
}

function styleFunc(feature) {
    switch (feature.properties.highlighted) {
        case true:
            return GAZ_STYLES.geojsonHighlightedCSS;
        case false:
            return GAZ_STYLES.geojsonDefaultCSS;
    } 
}


//function onFeatureSelect(f) {
//    var id = f.feature.attributes.id;
////    $('.highlightOverlay').hide().remove();
//  //  $('img').removeClass('mapSelect');
//    var $tr = $('#feature' + id);
//    $tr.css({"backgroundColor": "#C4DFFB"});
//}

//function onFeatureUnselect(f) {
//    var id = f.feature.attributes.id;
////    $('.highlightOverlay').hide().remove();
//  //  $('img').removeClass('mapSelect');
//    var $tr = $('#feature' + id);
//    $tr.css({"backgroundColor": "#ffffff"});    
//}

/*
function getLi(props) {
    var $li = $('<li />').addClass("mapListItem").attr("data-id", props.id);
    var $a = $('<a />').attr("target", "_blank").attr("href", "/admin/places/feature/" + props.id).text(props.preferred_name).appendTo($li);
    return $li;
}


function getHeaderRow() {
    var heads = ['Preferred Name', 'Feature Type', 'State', 'County']
    var $thead = $('<thead />');
}
*/
