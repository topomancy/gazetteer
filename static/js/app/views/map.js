define(['app/settings','leaflet', 'marionette', 'Backbone', 'underscore', 'jquery', 'app/core/mediator', 'text!app/views/map_popup.tpl'], function(settings, L, Marionette, Backbone, _, $, mediator, popupTemplate) {
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
        loadSearchResults: function(geojson) {
            console.log(geojson);
            this.resultsLayer.clearLayers();
            if (geojson.type == 'FeatureCollection') { //FIXME
                var cleanedGeoJSON = this.cleanGeoJSON(geojson);
            } else {
                var cleanedGeoJSON = geojson;
            }
            console.log(cleanedGeoJSON);

            if (cleanedGeoJSON.features.length > 0) {
                this.resultsLayer.addData(cleanedGeoJSON);
                this.zoomToExtent(this.resultsLayer);    
            }

            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.resultsLayer);
        },

        //hide place layer and show results layer
        showResults: function() {
            this.autoZoomed = true;
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.resultsLayer);
            this.zoomToExtent(this.resultsLayer);
        },

        //if geoJSON object contains features without geometries, remove them and return cleaned object.
        cleanGeoJSON: function(geojson) {
            var featuresWithGeom = [];
            _.each(geojson.features, function(feature) {
               if (!_.isEmpty(feature.geometry)) {
                    featuresWithGeom.push(feature);
                } 
            });
            geojson.features = featuresWithGeom;
            return geojson;
        },

        loadPlace: function(place) {
            this.placeLayerGroup.clearLayers();
            this.placeLayer.clearLayers();
            this.placeLayerGroup.addLayer(this.placeLayer);
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.placeLayerGroup);
            if (place.get("hasGeometry")) {
                console.log(place.toGeoJSON());
                this.placeLayer.addData(place.toGeoJSON());
                this.map.fitBounds(this.placeLayer.getBounds());
            }
        },

        zoomToExtent: function(layer) {
            if (!mediator.requests.request("isBBoxSearch") || !this.userMovedMap) {
                this.map.fitBounds(layer.getBounds());
                console.log("zoomToExtent called");
                this.autoZoomed = true;
            }
            this.userMovedMap = false;
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
        setBBox: function(bboxString) {
            if (this.userMovedMap) return;
            var arr = bboxString.split(",");
            console.log("arr", arr);
            var bbox = new L.LatLngBounds([
                [parseFloat(arr[1]), parseFloat(arr[0])],
                [parseFloat(arr[3]), parseFloat(arr[2])]
            ]);
            console.log("bbox", bbox);
            this.map.fitBounds(bbox);
            this.autoZoomed = true;
        },
        render: function() {
            console.log("render called");
            var that = this;
            this.popup = new L.Popup();
            this.userMovedMap = false; 
            this.autoZoomed = false;
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

            this.map.on("dragend", function() {
                that.dragEnd();
            });

            this.map.on("zoomend", function() {
                that.zoomEnd();
            });

            this.currentLayers = new L.LayerGroup().addTo(that.map);

            this.placeLayerGroup = new L.LayerGroup();
            this.placeLayer = L.geoJson(null, {

            }); 

            this.resultsLayer = L.geoJson(null, {
                onEachFeature: function(feature, layer) {
                    feature.properties.highlighted = false;
                    var id = feature.properties.id;
//                    layer.bindPopup(that.getPopupHTML(id));
                    layer.on("click", function(e) {
                        var popup = that.popup;
                        var bounds = layer.getBounds();
                        var popupContent = that.getPopupHTML(id);
                        popup.setLatLng(bounds.getCenter());
                        popup.setContent(popupContent);
                        that.map.openPopup(popup);
                        //layer.bindPopup(that.getPopupHTML(id));
                        //layer.openPopup();
                    });
                    layer.on("mouseover", function(e) {
                        layer.feature.properties.highlighted = true;
                        that.resultsLayer.setStyle(that.getHighlightedStyles);                
//                        //map.closePopup();
//                        var $row = $('#feature' + id);
//                        $row.addClass("highlighted");
                    });
                    layer.on("mouseout", function(e) {
                        layer.feature.properties.highlighted = false;
                        that.resultsLayer.setStyle(that.getHighlightedStyles);
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

        dragEnd: function() {
            this.mapMoved();
        },

        zoomEnd: function() {
            if (this.autoZoomed) {
                this.autoZoomed = false;
                return;
            }
            console.log('this', this);
            this.mapMoved();
        },

        mapMoved: function() {
            console.log("user moved map");
            if (mediator.requests.request("isResultsView")) {
                this.userMovedMap = true;
                mediator.commands.execute("search:setPage", 1);
                mediator.commands.execute("search:setWithinBBox");
                mediator.commands.execute("search:submit");
            }
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

        getPopupHTML: function(id) {
            var place = mediator.requests.request("getPlace", id);
            var tpl = _.template(popupTemplate);
            return tpl(place.attributes);
        },

        getLayerById: function(id) {
            var ret = false;
            this.resultsLayer.eachLayer(function(layer) {
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
