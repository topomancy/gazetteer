'use strict';

(function($) {

var map, jsonLayer;

$(function() {
    $('.mapListSection').css({'opacity': 0});
    $('#jsonLink').hide();

    var osm = new L.TileLayer($G.osmUrl,{minZoom:1,maxZoom:18,attribution:$G.osmAttrib});
    map = new L.Map('map', {layers: [osm], center: new L.LatLng(34.11577, -93.855211), zoom: 4 });

    //update search when map viewport changes
    map.on("moveend", function(e) {
        var center = map.getCenter();
        var zoom = map.getZoom();
        var urlData = queryStringToJSON(location.search);     
        if (urlData.lat == center.lat && urlData.lat == center.lng && urlData.zoom == center.zoom) {
            return;
        }
        
        
        setTimeout(function() {
            var newCenter = map.getCenter()
            var newZoom = map.getZoom()
            if (center.lat == newCenter.lat && center.lng == newCenter.lng && zoom == newZoom) {
                submitSearch({
                    'bboxChanged': true
                });
            }
        }, 400);

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
                var url = $G.placeUrlPrefix + feature.properties.id;
                location.href = url;
            });
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, $G.styles.geojsonDefaultCSS);
        }

    }).addTo(map);


    function submitSearch(options) {
        var o = $.extend({
            'bboxChanged': false,
            'pushState': true                
        }, options);
    
        var currentState = queryStringToJSON(location.search);

        var center = map.getCenter()
        var zoom = map.getZoom()
        var bbox = map.getBounds().toBBoxString();

        var search_term = $('#searchField').val();
        
        //if search term has changed from what's in the URL, set page no to 1
        if (currentState.hasOwnProperty("q")) {
            if (decodeURIComponent(currentState.q) != search_term) {
                $('#page_no').val('1');
            }                    
        }

        var page_no = parseInt($('#page_no').val());
        
        var totalPages = parseInt($('#totalPages').text());

        if (page_no > totalPages) {
            page_no = totalPages;
        }

        if ($.trim(search_term) === '') return;
        //location.hash = search_term;
        jsonLayer.clearLayers();
        $('#searchField').addClass("loading");
        $('#searchTerm').text(search_term);
        $('#searchField').attr("disabled", "disabled");
        $('#searchButton').attr("disabled", "disabled");
        $('#mapList tbody').empty();
        $('#currPageNo').text('*');
        
        var urlParams = "?" + 'q=' + encodeURIComponent(search_term) + '&lat=' + center.lat + '&lng=' + center.lng + '&zoom=' + zoom + '&page=' + page_no;

        if (o.pushState) {
            console.log("pushing state " + urlParams);
            history.pushState({}, "Gazetteer Search: " + search_term, urlParams);
        }

        //FIXME: rationalize URLs ?
        var geojsonUrl = "?" + 'q=' + encodeURIComponent(search_term) + '&bbox=' + bbox + '&page=' + page_no;        
        var feedUrl = $G.apiBase + "search.json" + geojsonUrl;

        
        $('#jsonLink').attr("href", feedUrl); 
        $.getJSON($G.apiBase + "search.json", {
            'bbox': bbox,
            'q': search_term,
            //'srid': 4326,
            'threshold': 0.5,
            'count': 20,
            'page': page_no
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
            //console.log(features);
            $('#currPageNo').text(features.page);
            //$('#page_no').val(features.page);
            $('#totalPages').text(features.pages);
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
    }

    $('#searchForm').submit(function(e) {
        e.preventDefault();
        submitSearch();
    });    

    //Handle URL / window onpopstate
    window.onpopstate = function(obj) {
        var queryString = location.search;
        var data = queryStringToJSON(queryString);
        if (data.q) {
            $('#searchField').val(decodeURIComponent(data.q));
        }
        if (data.page) {
            $('#page_no').val(data.page);
        }

        if (data.lat && data.lng) {
            if (!data.zoom) {
                data.zoom = 5; 
            }
            map.setView([data.lat, data.lng], data.zoom);
        }
        submitSearch({
            'pushState': false
        });
    };

    window.onpopstate();
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
    }, function() {
        var id = $(this).attr("id");
        id = id.replace("feature", "");
        var layer = getFeatureById(id);
        layer.feature.properties.highlighted = false;
        jsonLayer.setStyle(styleFunc);            
    });
    var $one = $('<td />').addClass("col1").appendTo($tr);
    var $a = $('<a />').attr("href", $G.placeUrlPrefix + props.id).text(props.name).appendTo($one);
//    var $a2 = $('<a />').addClass("viewSimilar").attr("target", "_blank").attr("href", "/search_related?id=" + props.id).text("view similar").appendTo($one);
    $('<td />').addClass("col2").text(props.feature_code_name).appendTo($tr);
//    $('<td />').text(props.admin2).appendTo($tr);
//    $('<td />').text(props.admin1).appendTo($tr);
    return $tr;     
}


function getFeatureById(feature_id) {
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
            return $G.styles.geojsonHighlightedCSS;
        case false:
            return $G.styles.geojsonDefaultCSS;
    } 
}

//FIXME: move following utility functions somewhere, perhaps gazetteer.js
/*
>>>var foo = {'var1': 'bar', 'var2': 'baz'}
>>> JSONtoQueryString(foo);
'?var1=bar&var2=baz'
*/
function JSONtoQueryString(obj) {
    var s = "?";
    for (var o in obj) {
        if (obj.hasOwnProperty(o)) {
            s += o + "=" + obj[o] + "&";
        }
    }
    return s.substring(0, s.length - 1);
}

/*
>>>var foo = "/something/bla/?var1=bar&var2=baz";
>>>QueryStringToJSON(foo);
{'var1': 'bar', 'var2': 'baz'}
*/
function queryStringToJSON(qstring) {
    if (qstring.indexOf("?") == -1) {
        return {};
    }
    var q = qstring.split("?")[1];
    var args = {};
    var vars = q.split('&');
//    console.log(vars);
    for (var i=0; i<vars.length; i++) {
        var kv = vars[i].split('=');
        var key = kv[0];
        var value = kv[1];
        args[key] = value;
    }		
    return args;		
}


/*
>>>bboxFromString('-1,2,-5,6')
>>>[[2,-1],[6,-5]]
*/
function bboxFromString(s) {
    var points = s.split(",");
    var southwest = new L.LatLng(points[1], points[0]);
    var northeast = new L.LatLng(points[3], points[2]);
    return [southwest, northeast]
}

})(jQuery);

