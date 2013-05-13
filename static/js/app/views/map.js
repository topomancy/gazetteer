define(['app/settings','leaflet', 'marionette', 'Backbone', 'underscore', 'jquery', 'app/core/mediator', 'text!app/views/map_popup.tpl', 'leaflet-draw'], function(settings, L, Marionette, Backbone, _, $, mediator, popupTemplate) {
    var MapView = Marionette.ItemView.extend({
        el: '#mapBlock',
        ui: {
            'map': '#map'
        },
        events: {

        },

        initialize: function() {
            var that = this;
            mediator.events.on('login', function(user) {
                if (that.currentPlace) {
                    that.makePlaceEditable();   
                } 
            });
        },

        /*
            creates the Leflet map, sets up event handlers and calls initLayers 
        */
        render: function() {
            var that = this;
            this.popup = new L.Popup();
            this.userMovedMap = false; 
            this.autoZoomed = false;
            //set default imagePath, needed to work when leaflet is minified
            L.Icon.Default.imagePath = '/static/js/libs/leaflet/images';
            this.baseLayer = new L.TileLayer(settings.osmUrl,{
                minZoom:1,
                maxZoom:18,
                attribution:settings.osmAttrib
            });

            this.map = new L.Map('map', {
                layers: [that.baseLayer], 
                center: new L.LatLng(settings.centerLat, settings.centerLon),
                zoom: settings.defaultZoom, 
                crs: L.CRS.EPSG900913 
            });

            this.map.on("dragend", function() {
                that.dragEnd();
            });

            this.map.on("zoomend", function() {
                that.zoomEnd();
            });

            this.map.on("draw:edited", function(e) {
                var geometry = e.layers.getLayers()[0].toGeoJSON();
                that.currentPlace.set("geometry", geometry)   
            });
            this.map.on("draw:created", function(e) {
                var geometry = e.layer.toGeoJSON();
                that.placeLayer.addData(geometry);
                that.currentPlace.set("geometry", geometry);
                that.makePlaceEditable();
            });
            this.map.on("draw:deleted", function(e) {
                that.placeLayer.clearLayers();
                that.currentPlace.set("geometry", false).set("geometry", {}); //FIXME: just setting to {} does not work for some reason (it keeps old value).
                that.makePlaceEditable();
            });

            this.initLayers();


            return this;
        },

        /*
            Initializes layers on the map:
                currentLayers is a LayerGroup to hold the currently 'active' layer - other layers add and remove themselves from currentLayers to toggle their display.
                placeLayerGroup holds all layers relevant to a single place - the place itself, wms layers, admin boundaries, relations, etc.
                resultsLayer is the layer responsible for displaying results    
        */
        initLayers: function() {
            var that = this;
            this.currentLayers = new L.LayerGroup().addTo(this.map);
            this.placeLayerGroup = new L.LayerGroup();
            this.placeLayer = L.geoJson(null, {

            }); 

            this.resultsLayer = L.geoJson(null, {
                onEachFeature: function(feature, layer) {
                    feature.properties.highlighted = false;
                    var id = feature.properties.id;
                    layer.on("click", function(e) {
                        var popup = that.popup;
                        var bounds = layer.getBounds();
                        var popupContent = that.getPopupHTML(id);
                        popup.setLatLng(bounds.getCenter());
                        popup.setContent(popupContent);
                        that.map.openPopup(popup);
                    });
                    layer.on("mouseover", function(e) {
                        layer.feature.properties.highlighted = true;
                        that.resultsLayer.setStyle(that.getHighlightedStyles);                
                    });
                    layer.on("mouseout", function(e) {
                        layer.feature.properties.highlighted = false;
                        that.resultsLayer.setStyle(that.getHighlightedStyles);
                    });
                    layer.setStyle(settings.styles.geojsonDefaultCSS);
                },
                pointToLayer: function(feature, latlng) {
                    //Convert point fields to circle markers to display on map
                    return L.circleMarker(latlng, settings.styles.geojsonDefaultCSS);
                }

            });
        },

        loadSearchResults: function(geojson) {
            this.resultsLayer.clearLayers();
            if (geojson.type == 'FeatureCollection') { //FIXME
                var cleanedGeoJSON = this.cleanGeoJSON(geojson);
            } else {
                var cleanedGeoJSON = geojson;
            }

            if (cleanedGeoJSON.features.length > 0) {
                this.resultsLayer.addData(cleanedGeoJSON);
                this.zoomToExtent(this.resultsLayer);    
            }

            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.resultsLayer);
            if (this.drawControl && this.drawControl._map) {
                this.drawControl.removeFrom(this.map);
            }
        },

        //hide place layer and show results layer
        showResults: function() {
            this.autoZoomed = true;
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.resultsLayer);
            if (this.resultsLayer.getLayers().length > 0) {
                this.zoomToExtent(this.resultsLayer);
            }
            if (this.drawControl && this.drawControl._map) {
                this.drawControl.removeFrom(this.map);
            }
        },

        showPlace: function() {
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.placeLayerGroup);
            if (this.currentPlace.hasGeometry()) {
                this.map.fitBounds(this.placeLayer.getBounds());
            }
            if (this.drawControl) {
                this.drawControl.addTo(this.map);
            }
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
            var app = require('app/app');
            this.currentPlace = place;
            this.placeLayerGroup.clearLayers();
            this.placeLayer.clearLayers();
            this.placeLayerGroup.addLayer(this.placeLayer);
            this.loadWMSLayers(place);
            if (!_.isEmpty(app.user)) {
                this.makePlaceEditable();
            }
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.placeLayerGroup);
            if (place.hasGeometry()) {
                this.placeLayer.addData(place.toGeoJSON());
                this.map.fitBounds(this.placeLayer.getBounds());
            };
            //this.showPlace();
        },

        makePlaceEditable: function() {
            var that = this,
                options = {},
                place = this.currentPlace;
            if (!place) {
                console.log("makePlaceEditable called without a place!");
                return false;
            }
            if (place.hasGeometry()) {
                options = {
                    draw: false,
                    edit: {
                        featureGroup: that.placeLayer
                    }
                }
            } else {
                options = {
                    draw: {
                        rectangle: false,
                        circle: false
                    },
                    edit: false
                }     
            }
            if (this.drawControl && this.drawControl._map) { //FIXME: should be a better way to check if drawControl is currently added to map?
                this.drawControl.removeFrom(this.map);
            }
            this.drawControl = new L.Control.Draw(options);
            if (!mediator.requests.request("isResultsView")) { //FIXME: create a more generic mediator request like "getActiveContent"
                this.map.addControl(this.drawControl);
            }
     
        },

        loadWMSLayers: function(place) {
            var that = this;
            var layers = place.getWMSLayers();
            if (layers.length > 0) {
                _.each(layers, function(layer) {
                    var wmsLayer = L.tileLayer.wms(layer, {'format': 'image/png'}).setZIndex(1000);
                    that.placeLayerGroup.addLayer(wmsLayer);  
                });
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
            if (place.get("hasGeometry")) {
                var id = place.attributes.properties.id;
                var layer = this.getLayerById(id);
                layer.feature.properties.highlighted = true;
                var styles = this.getHighlightedStyles(layer.feature);
                layer.setStyle(styles); 
                layer.bringToFront();
            }
        },

        unhighlight: function(place) {
            if (place.get("hasGeometry")) {
                var id = place.attributes.properties.id;
                var layer = this.getLayerById(id);
                layer.feature.properties.highlighted = false;
                var styles = this.getHighlightedStyles(layer.feature);
                layer.setStyle(styles);
            }
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

    return MapView;
});
