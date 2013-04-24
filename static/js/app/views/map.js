define(['app/settings','leaflet', 'marionette', 'Backbone', 'jquery', 'app/core/mediator'], function(settings, L, Marionette, Backbone, $, mediator) {
    var MapView = Marionette.ItemView.extend({
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
        },
        loadGeoJSON: function(geojson) {
            console.log(geojson);
            this.jsonLayer.clearLayers();
            if (geojson.features.length === 0) {
                return;
            }
            var cleanedGeoJSON = this.cleanGeoJSON(geojson);
            this.jsonLayer.addData(geojson);
            this.zoomToExtent();    
        },

        //if geoJSON object contains features without geometries, remove them and return cleaned object.
        cleanGeoJSON: function(geojson) {
            return geojson;
        },

        loadPlace: function(place) {
            this.loadGeoJSON(place.attributes);
            //this.zoomTo(place);
        },
        zoomToExtent: function() {
            var bounds = this.getBounds();
            this.map.fitBounds(bounds);
        },
        getBounds: function() {
            return this.jsonLayer.getBounds();
        },
        getBBoxString: function() {
            var leafletBounds = this.map.getBounds().toBBoxString();
            var arr = leafletBounds.split(",");
            arr[0] = parseFloat(arr[0]) <= -180 ? '-179.99' : arr[0];
            arr[1] = parseFloat(arr[1]) <= -90 ? '-89.99' : arr[1];
            arr[2] = parseFloat(arr[2]) >= 180 ? '179.99' : arr[2];
            arr[3] = parseFloat(arr[3]) >= 90 ? '89.99' : arr[3];
            return arr.join(",");
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
        },

        highlight: function(place) {
            var id = place.attributes.properties.id;
            console.log(id);
            var layer = this.getLayerById(id);
            layer.feature.properties.highlighted = true;
            var styles = this.getHighlightedStyles(layer.feature);
            layer.setStyle(styles); 
            layer.bringToFront();
        },

        unhighlight: function(place) {
            var id = place.attributes.properties.id;
            var layer = this.getLayerById(id);
            layer.feature.properties.highlighted = false;
            var styles = this.getHighlightedStyles(layer.feature);
            layer.setStyle(styles);
        },

        zoomTo: function(place) {
            var layer = this.getLayerById(place.get('properties.id'));
            var bounds = layer.getBounds();
            this.map.fitBounds(bounds);
        },

        getLayerById: function(id) {
            var ret = false;
            this.jsonLayer.eachLayer(function(layer) {
                if (layer.feature.properties.id == id) {
                    ret = layer;
                }
            });
            return ret;
        },

        getHighlightedStyles: function(feature) {
            switch (feature.properties.highlighted) {
                case true:
                    return settings.styles.geojsonHighlightedCSS;
                case false:
                    return settings.styles.geojsonDefaultCSS;
            } 
        }
    });
        

    //console.log(L);
    return MapView;
});
