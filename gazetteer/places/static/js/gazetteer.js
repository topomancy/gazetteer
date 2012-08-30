$(function() {
    $('.mapListSection').css({'opacity': 0});
    $('#jsonLink').hide();
    map = new OpenLayers.Map('map', {});
    var baseLayer = new OpenLayers.Layer.OSM( "Openstreetmap Base Layer");
//    map.addLayer(baseLayer);
    var geojson_format = new OpenLayers.Format.GeoJSON();
    var jsonLayer = new OpenLayers.Layer.Vector();

    map.addLayers([baseLayer, jsonLayer]);
    var center = new OpenLayers.LonLat(-95, 37.5).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                ); 
    map.setCenter(center, 4);
    var mapControl = new OpenLayers.Control.SelectFeature(jsonLayer, {hover: true});
    map.addControl(mapControl);
    mapControl.activate();
    jsonLayer.events.on({
      'featureselected': onFeatureSelect,
      'featureunselected': onFeatureUnselect
    }); 


    function getFeatureById(id) {
      var features = jsonLayer.features;
      for (var i=0; i < features.length; i++) {
        if (features[i].attributes.id == id) {
          return features[i];
        }
      }  
      return false;
    }

    $('#searchForm').submit(function(e) {
        e.preventDefault();
        var bbox = map.getExtent().toBBOX();
        var search_term = $('#searchField').val();
        $('#searchField').addClass("loading");
        $('#searchTerm').text(search_term);
        $('#searchField').attr("disabled", "disabled");
        $('#mapList tbody').empty();
        var url = "/feature/search.json?" + 'bbox=' + bbox + '&q=' + search_term + '&srid=' + '3785' + '&count=20&page=' + $('#page_no').val();
        $('#jsonLink').attr("href", url); 
        $.getJSON("/feature/search.json", {
            'bbox': bbox,
            'q': search_term,
            'srid': 3785,
            'threshold': 0.5,
            'count': 20,
            'page': $('#page_no').val()
            }, function(features) {
            if ($('.mapListSection').css("opacity") == '0') {
                $('.mapListSection').animate({'opacity': '1'}, 1000);
                $('#jsonLink').show();
            }
            if (features.hasOwnProperty("error") && features.error != '') {
                alert(features.error);
                return;
            }

            $('#noOfResults').text(features.results);
            $('#currPageNo').text(features.current_page);
            $('#totalPages').text(features.pages);
            $('#searchField').removeAttr("disabled");
            $('#searchField').removeClass("loading");
//            var headerRow = getHeaderRow();
//            console.log(response);
            var currFeatures = jsonLayer.features;
            jsonLayer.removeFeatures(currFeatures);
            jsonLayer.addFeatures(geojson_format.read(features));
            for (var i=0; i<features.features.length;i++) {
                var f = features.features[i];
                var props = f.properties;
                var listItem = getRow(props);
                $('#mapList tbody').append(listItem);
            }             
        });
    });

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

    function getRow(props) {
        var $tr = $('<tr />').attr("id", "feature" + props.id).data("id", props.id).hover(function() {
            var id = $(this).data("id");
            var feature = getFeatureById(id);
            mapControl.select(feature);
        }, function() {
            var id = $(this).data("id");
            var feature = getFeatureById(id);
            mapControl.unselect(feature);            
        });
        var $one = $('<td />').appendTo($tr);
        var $a = $('<a />').attr("href", "/admin/places/feature/" + props.id).text(props.preferred_name).appendTo($one);
    //    var $a2 = $('<a />').addClass("viewSimilar").attr("target", "_blank").attr("href", "/search_related?id=" + props.id).text("view similar").appendTo($one);
        $('<td />').text(props.feature_type).appendTo($tr);
        $('<td />').text(props.admin2).appendTo($tr);
        $('<td />').text(props.admin1).appendTo($tr);
        return $tr;     
    }




function getRow(props) {
    var $tr = $('<tr />').attr("id", "feature" + props.id).data("id", props.id).hover(function() {
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
    var $one = $('<td />').appendTo($tr);
    var $a = $('<a />').attr("href", "/admin/places/feature/" + props.id).text(props.preferred_name).appendTo($one);
//    var $a2 = $('<a />').addClass("viewSimilar").attr("target", "_blank").attr("href", "/search_related?id=" + props.id).text("view similar").appendTo($one);
    $('<td />').text(props.feature_type).appendTo($tr);
    $('<td />').text(props.admin2).appendTo($tr);
    $('<td />').text(props.admin1).appendTo($tr);
    return $tr;     
}


function onFeatureSelect(f) {
    var id = f.feature.attributes.id;
//    $('.highlightOverlay').hide().remove();
  //  $('img').removeClass('mapSelect');
    var $tr = $('#feature' + id);
    $tr.css({"backgroundColor": "#C4DFFB"});
}

function onFeatureUnselect(f) {
    var id = f.feature.attributes.id;
//    $('.highlightOverlay').hide().remove();
  //  $('img').removeClass('mapSelect');
    var $tr = $('#feature' + id);
    $tr.css({"backgroundColor": "#ffffff"});    
}

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
