define(['app/settings','leaflet', 'marionette', 'Backbone', 'jquery', 'app/core/mediator'], function(settings, L, Marionette, Backbone, $, mediator) {
    var MapView = Marionette.View.extend({
        //template: _.template(mapTemplate),
        el: '#mapBlock',
        ui: {
            'map': '#map'
        },
        events: {

        },
        initialize: function() {
            var that = this;
            console.log("mapview initialized");
            mediator.events.on("test:event", function() {
                console.log("map view received test event");
            });
            mediator.events.on("search:parse", function(geojson) {
                that.loadGeoJSON(geojson);
            });
        },
        loadGeoJSON: function(geojson) {
            this.jsonLayer.clearLayers();
            this.jsonLayer.addData(geojson);    
        },
        render: function() {
            console.log("render called");
            var that = this;
            this.baseLayer = new L.TileLayer(settings.osmUrl,{
                minZoom:1,
                maxZoom:18,
                attribution:settings.osmAttrib
            });
            this.map = new L.Map('map', {
                layers: [that.baseLayer], 
                center: new L.LatLng(settings.centerLat, settings.centerLon),
                zoom: settings.defaultZoom 
            });
    //Define JSON layer
            this.jsonLayer = L.geoJson(null, {
                onEachFeature: function(feature, layer) {
                    feature.properties.highlighted = false;
                    var id = feature.properties.id;
                    //layer.bindPopup(that.getPopupHTML(layer.feature.properties));
                    layer.on("mouseover", function(e) {
//                        layer.feature.properties.highlighted = true;
//                        that.jsonLayer.setStyle(styleFunc);                
//                        //map.closePopup();
//                        var $row = $('#feature' + id);
//                        $row.addClass("highlighted");
                    });
                    layer.on("mouseout", function(e) {
//                        layer.feature.properties.highlighted = false;
//                        that.jsonLayer.setStyle(styleFunc);
//                        var $row = $('#feature' + id);
//                        $row.removeClass("highlighted");            
                    });
        //            layer.on("click", function(e) {
        //                var url = $G.placeUrlPrefix + feature.properties.id;
        //                location.href = url;
        //            });
                    layer.setStyle(settings.styles.geojsonDefaultCSS);
                },
                pointToLayer: function(feature, latlng) {
                    //Convert point fields to circle markers to display on map
                    return L.circleMarker(latlng, settings.styles.geojsonDefaultCSS);
                }

            }).addTo(that.map);

            return this;
        }

    });
        

    //console.log(L);
    return MapView;
});
