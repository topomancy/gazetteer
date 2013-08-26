define(['app/settings','leaflet', 'marionette', 'Backbone', 'underscore', 'jquery', 'app/core/mediator', 'app/models/place', 'text!app/views/map_popup.tpl', 'leaflet-draw'], function(settings, L, Marionette, Backbone, _, $, mediator, Place, popupTemplate) {
    var MapView = Marionette.ItemView.extend({
        el: '#mapBlock',
        ui: {
            'map': '#map'
        },
        events: {

        },

        initialize: function() {
            var that = this;
            this.bindUIElements();
            mediator.events.on('login', function(user) {
                if (that.currentPlace) {
                    that.makePlaceEditable();   
                } 
            });
            this.listenTo(mediator.events, 'logout', this.makePlaceUneditable);
            $(window).resize(function() {
                that.resize();
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

            //define base layer settings
            this.baseLayer = new L.TileLayer(settings.osmUrl,{
                minZoom:1,
                maxZoom:18,
                attribution:settings.osmAttrib,
                zIndex:0
            });
            
            //initialize map
            this.map = new L.Map('map', {
                layers: [that.baseLayer], 
                center: new L.LatLng(settings.centerLat, settings.centerLon),
                zoom: settings.defaultZoom, 
                crs: L.CRS.EPSG900913 
            });

            //define event handlers for drag and zoom
            this.map.on("dragend", function() {
                that.dragEnd();
            });

            this.map.on("zoomend", function() {
                that.zoomEnd();
            });

            /*
                Since events inside the map popup do not propagate, we need to make sure we attach a click handler to links inside the popup to handle router navigation
                See http://stackoverflow.com/questions/13698975/click-link-inside-leaflet-popup-and-do-javascript
            */
            this.map.on("popupopen", function() {
                $('a.popuplink').click(function(e) {
                    e.preventDefault();
                    var href = $(this).attr("href");
                    Backbone.history.navigate(href, true);
                });
            });

            //define event handlers for drawing actions on map. FIXME: should these only be added if user is editing, or at least only if user is logged in?
            this.map.on("draw:edited", function(e) {
                var geometry = that.placeLayer.getLayers()[0].toGeoJSON();
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
                that.currentPlace.set("geometry", false).set("geometry", {}); //just setting to {} does not work for some reason (it keeps old value).
                that.makePlaceEditable();
            });

            //overlayadd and remove are fired when layers are added and removed by user from the layer switcher (for historical map layers)
            this.map.on("overlayadd", that.overlayAdded);
            this.map.on("overlayremove", that.overlayRemoved);

            //call resize() to resize the map container to fit the height of the viewport
            this.resize();
            
            this.initLayers();

            return this;
        },


        /*
            get layer config for specified layer - used to get config for resultsLayer and selectedPlacesLayer since they are mostly similar
        */
        getLayersConfig: function(layerName) {
            var that = this;
            return {
                onEachFeature: function(feature, layer) {
                    feature.properties.highlighted = false;
                    var id = feature.properties.id;
                    var geomType = feature.geometry.type;
                    if (geomType == 'MultiPolygon') {
                        layer.eachLayer(function(l) {
                            L.setOptions(l, {'smoothFactor': settings.smoothFactor});
                        });
                    } else if (geomType == 'Polygon') {
                        L.setOptions(layer, {'smoothFactor': settings.smoothFactor});
                    }

                    layer.on("click", function(e) {
                        var popup = that.popup;
                        var bounds = layer.getBounds();
                        var place = new Place({'properties': feature.properties});
                        var popupContent = that.getPopupHTML(place);
                        popup.setLatLng(bounds.getCenter());
                        popup.setContent(popupContent);
                        that.map.openPopup(popup);
                    });
                    layer.on("mouseover", function(e) {
                        layer.feature.properties.highlighted = true;
                        that[layerName].setStyle(that.getHighlightedStyles);                
                    });
                    layer.on("mouseout", function(e) {
                        layer.feature.properties.highlighted = false;
                        that[layerName].setStyle(that.getHighlightedStyles);
                    });
                    layer.setStyle(settings.styles.geojsonDefaultCSS);
                },
                pointToLayer: function(feature, latlng) {
                    //Convert point fields to circle markers to display on map
                    return L.circleMarker(latlng, settings.styles.geojsonDefaultCSS);
                }
            }
        },

        /*
            Initializes layers on the map:
                currentLayers is a LayerGroup to hold the currently 'active' layer - other layers add and remove themselves from currentLayers to toggle their display.
                placeLayerGroup holds all layers relevant to a single place - the place itself, wms layers, admin boundaries, relations, etc.
                resultsLayer is the layer responsible for displaying results    
                selectedPlacesLayer is the layer responsible for displaying selected places
        */
        initLayers: function() {
            var that = this;
            this.currentLayers = new L.FeatureGroup().addTo(this.map);
            this.placeLayerGroup = new L.FeatureGroup();
            this.placeWMSLayer = new L.FeatureGroup();
            this.placeLayer = L.geoJson(null, {

            });

            this.relationsLayer = new L.geoJson(null, this.getLayersConfig('relationsLayer'));
            this.similarPlacesLayer = new L.geoJson(null, this.getLayersConfig('similarPlacesLayer'));
            this.selectedPlacesLayer = L.geoJson(null, this.getLayersConfig('selectedPlacesLayer'));
            this.resultsLayer = L.geoJson(null, this.getLayersConfig('resultsLayer'));

            this.layersControl = new L.Control.Layers(null,{});
        },


        resize: function() {
            var windowHeight = $(window).height();
            var headerHeight = $('#siteHeader').outerHeight() + $('#searchToggleBlock').outerHeight();
            //var searchBarHeight = $('#searchToggleBlock').height();
            var footerHeight = $('#footer').outerHeight();
            //var mapTop = headerHeight + searchBarHeight;
            var mapHeight = windowHeight - (headerHeight + footerHeight);
            this.ui.map.height(mapHeight);
            this.ui.map.css({'top': headerHeight + 'px'});
            this.map.invalidateSize();
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
            this.hideDisplayedLayers();
            this.currentLayers.addLayer(this.resultsLayer);
            if (this.drawControl && this.drawControl._map) {
                this.drawControl.removeFrom(this.map);
            }
            $("div.leaflet-control-layers").hide();
        },

        //hide place layer and show results layer
        showResults: function() {
            this.autoZoomed = true;
            this.currentLayers.clearLayers();
            this.hideDisplayedLayers();
            this.currentLayers.addLayer(this.resultsLayer);
            if (this.resultsLayer.getLayers().length > 0) {
                this.zoomToExtent(this.resultsLayer);
            }
            if (this.drawControl && this.drawControl._map) {
                this.drawControl.removeFrom(this.map);
            }
            $("div.leaflet-control-layers").hide();
        },

        showPlace: function() {
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.placeLayerGroup);
            this.currentLayers.addLayer(this.placeWMSLayer);
            this.showDisplayedLayers();
            if (this.currentPlace.hasGeometry()) {
                this.map.fitBounds(this.placeLayer.getBounds());
            }
            if (this.drawControl) {
                this.drawControl.addTo(this.map);
            }
            var app = require('app/app');
            if (app.collections.layers.length > 0) {
                $("div.leaflet-control-layers").show();
            }
        },

        showSelectedPlaces: function() {
            this.autoZoomed = true;
            this.currentLayers.clearLayers();
            this.hideDisplayedLayers();
            this.currentLayers.addLayer(this.selectedPlacesLayer);
            if (this.selectedPlacesLayer.getLayers().length > 0) {
                this.zoomToExtent(this.selectedPlacesLayer);
            }
            if (this.drawControl && this.drawControl._map) {
                this.drawControl.removeFrom(this.map);
            }
            $("div.leaflet-control-layers").hide();
        },

        addSelectedPlace: function(place) {
            if (place.hasGeometry()) {
                this.selectedPlacesLayer.addData(place.toGeoJSON());
            }
            
        },

        removeSelectedPlace: function(place) {
            var layer = this.getLayerById(place.id, 'selectedPlacesLayer');
            this.selectedPlacesLayer.removeLayer(layer);
        },

        loadRelations: function(relations) {
            this.relationsLayer.clearLayers();
            this.placeLayerGroup.addLayer(this.relationsLayer);
            var currentPlace = mediator.requests.request("getCurrentPlace");
            if (relations.features.length > 0) {
                this.relationsLayer.addData(relations);
                if (currentPlace.hasGeometry()) {
                    this.zoomToExtent(this.placeLayerGroup);
                } else {
                    this.zoomToExtent(this.relationsLayer);
                }
            }
        },

        deleteRelation: function(id) {
            var that = this;
            this.relationsLayer.eachLayer(function(layer) {
                if (layer.feature.properties.id === id) {
                    that.relationsLayer.removeLayer(layer);
                }    
            });
        },

        removeRelations: function() {
            this.relationsLayer.clearLayers();
            this.placeLayerGroup.removeLayer(this.relationsLayer);
            var currentPlace = mediator.requests.request("getCurrentPlace");
            if (currentPlace.hasGeometry()) {
                this.zoomToExtent(this.placeLayer);
            }
        },

        loadSimilar: function(similarPlaces) {
            this.similarPlacesLayer.clearLayers();
            this.placeLayerGroup.addLayer(this.similarPlacesLayer);
            var cleanedSimilarPlaces = this.cleanGeoJSON(similarPlaces);
            var currentPlace = mediator.requests.request("getCurrentPlace");
            if (cleanedSimilarPlaces.features.length > 0) {
                this.similarPlacesLayer.addData(cleanedSimilarPlaces);
                if (currentPlace.hasGeometry()) {
                    this.zoomToExtent(this.placeLayerGroup);
                } else {
                    this.zoomToExtent(this.similarPlacesLayer);
                }
            }
        },

        removeSimilar: function() {
            this.similarPlacesLayer.clearLayers();
            this.placeLayerGroup.removeLayer(this.similarPlacesLayer);
            var currentPlace = mediator.requests.request("getCurrentPlace");
            if (currentPlace.hasGeometry()) {
                this.zoomToExtent(this.placeLayerGroup);
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
            var user = mediator.requests.request("getUser");
            this.currentPlace = place;
            this.placeLayerGroup.clearLayers();
            this.placeLayer.clearLayers();
            this.placeLayerGroup.addLayer(this.placeLayer);
            this.currentLayers.clearLayers();
            this.currentLayers.addLayer(this.placeLayerGroup);
            this.loadWMSLayers(place);
            if (place.hasGeometry()) {
                this.placeLayer.addData(place.toGeoJSON());
                this.map.fitBounds(this.placeLayer.getBounds());
            };
            if (user) {
                this.makePlaceEditable();
            }
            //$("div.leaflet-control-layers").show();
        },

        makePlaceEditable: function() {
            var that = this,
                options = {},
                place = this.currentPlace;
            if (!place) {
                return false;
            }
            if (place.hasGeometry()) {
                var editableGroup = this.placeLayer.getLayers()[0].toGeoJSON().type == 'MultiPolygon' ? this.placeLayer.getLayers()[0] : this.placeLayer;
            } else {
                var editableGroup = this.placeLayer;
            }
            if (place.hasGeometry()) {
                options = {
                    draw: false,
                    edit: {
                        featureGroup: editableGroup
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
            if (mediator.requests.request("getCurrentView") == 'place') { 
                this.map.addControl(this.drawControl);
            }
     
        },

        makePlaceUneditable: function() {
            if (this.drawControl && this.drawControl._map) { //FIXME: should be a better way to check if drawControl is currently added to map?
                this.drawControl.removeFrom(this.map);
            }
            this.drawControl = null;
        },

        loadWMSLayers: function(place) {
            var that = this;
            var layers = place.getWMSLayers();
            this.placeWMSLayer.clearLayers();
            if (layers.length > 0) {
                _.each(layers, function(layer) {
                    var wmsLayer = L.tileLayer.wms(layer, {'format': 'image/png', 'zIndex': 1});
                    that.placeWMSLayer.addLayer(wmsLayer);
                });
            }
            this.currentLayers.addLayer(this.placeWMSLayer);
        },

        zoomToExtent: function(layer) {
            if (layer.getLayers().length === 0) {
                return;
            }
            if (!mediator.requests.request("isBBoxSearch") || !this.userMovedMap) {
                this.autoZoomed = true;
                this.map.fitBounds(layer.getBounds());
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
            var bbox = new L.LatLngBounds([
                [parseFloat(arr[1]), parseFloat(arr[0])],
                [parseFloat(arr[3]), parseFloat(arr[2])]
            ]);
            this.map.fitBounds(bbox);
            this.autoZoomed = true;
        },
        getBounds: function(){
           return this.map.getBounds();
        },

        dragEnd: function() {
            this.mapMoved();
        },

        zoomEnd: function() {
            if (this.autoZoomed) {
                this.autoZoomed = false;
                return;
            }
            this.mapMoved();
        },

        mapMoved: function() {
            if (mediator.requests.request("isResultsView")) {
                this.userMovedMap = true;
                if (mediator.requests.request("isBBoxSearch")) {
                    mediator.commands.execute("search:setPage", 1);
                    //mediator.commands.execute("search:setWithinBBox");
                    mediator.commands.execute("search:submit");
                }
            }
        },

        highlight: function(place, displayLayer) {
            if (place.get("hasGeometry")) {
                var id = place.attributes.properties.id;
                var layer = this.getLayerById(id, displayLayer);
                layer.feature.properties.highlighted = true;
                var styles = this.getHighlightedStyles(layer.feature);
                layer.setStyle(styles); 
                layer.bringToFront();
            }
        },

        unhighlight: function(place, displayLayer) {
            if (place.get("hasGeometry")) {
                var id = place.attributes.properties.id;
                var layer = this.getLayerById(id, displayLayer);
                layer.feature.properties.highlighted = false;
                var styles = this.getHighlightedStyles(layer.feature);
                layer.setStyle(styles);
            }
        },

        zoomTo: function(place) {
            if (place.hasGeometry()) {
                var layer = this.getLayerById(place.get('properties.id'));
                var bounds = layer.getBounds();
                this.autoZoomed = true;
                this.map.fitBounds(bounds);
            }
        },

        getPopupHTML: function(place) {
            var tpl = _.template(popupTemplate);
            return tpl(place.attributes);
        },

        getLayerById: function(id, displayLayer) {
            var ret = false;
            if (!displayLayer) {
                displayLayer = 'resultsLayer';
            }
            this[displayLayer].eachLayer(function(layer) {
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
        },

        //mark layer as isDisplayed
        overlayAdded: function(e) {
            var app = require('app/app');
            var layerPattern = e.layer.layer._url;
            var layerModel = app.collections.layers.where({'pattern': layerPattern})[0];
            layerModel.set("isDisplayed", true);
        },

        //mark layer as not displayed
        overlayRemoved: function(e) {
            var app = require('app/app');
            var layerPattern = e.layer.layer._url;
            var layerModel = app.collections.layers.where({'pattern': layerPattern})[0];
            layerModel.set("isDisplayed", false);
        },

        //hide all historical map layers that are displayed (when switching away from place detail view)
        hideDisplayedLayers: function() {
            var app = require('app/app');
            var that = this;
            var displayedLayers = app.collections.layers.where({'isDisplayed': true});
            _.each(displayedLayers, function(displayedLayer) {
                var layer = displayedLayer.get("leafletLayer");
                that.map.removeLayer(layer);
            });
        },

        //show all historical map layers marked as "isDisplayed", when navigating back to place detail view
        showDisplayedLayers: function() {
            var app = require('app/app');
            var that = this;
            var displayedLayers = app.collections.layers.where({'isDisplayed': true});
            _.each(displayedLayers, function(displayedLayer) {
                var layer = displayedLayer.get("leafletLayer");
                that.map.addLayer(layer);
            });
        },

        loadLayers: function(layers_collection){
            var that = this;
            var layers = layers_collection.toJSON();

            //Get the list of layers from the control
            var lc_layers = this.layersControl._layers;
            var lc_layers_array = [];
            _.each(lc_layers, function(lc_layer){
                lc_layers_array.push(lc_layer.layer._url)
            });

         
            var newLayerUrls = []

           //add new layers to control
            _.each(layers, function(layer) {
                var name = layer.date + " "+layer.name.substring(0,25);
                var tempLayer = new L.TileLayer(layer.pattern, {
                    minZoom:1,
                    maxZoom:20
                });
                var layerModel = layers_collection.where({'id': layer.id})[0];
                layerModel.set("leafletLayer", tempLayer);
                if (lc_layers_array.indexOf(layer.pattern) == -1){
                    that.layersControl.addOverlay(tempLayer, name);
                }

                newLayerUrls.push(layer.pattern);
            })

            //remove any layers from control
            _.each(lc_layers, function(lc_layer){
                if (newLayerUrls.indexOf(lc_layer.layer._url) == -1){
                    that.map.removeLayer(lc_layer.layer)
                    that.layersControl.removeLayer(lc_layer.layer)
                }
                
            });
          
            if (newLayerUrls.length > 0 && !this.layersControl._map){ //if layer control not added to map
                this.layersControl.addTo(this.map);
            } else if (newLayerUrls.length == 0){ //if layers are 0, hide layers control           
                if ($("div.leaflet-control-layers").is(":visible")) {
                    $("div.leaflet-control-layers").hide();
                }  
                //this.map.removeControl(this.layersControl);
           } else if (newLayerUrls.length > 0 && this.layersControl._map) { //if layers > 0, and control already attached to map, show it
                $("div.leaflet-control-layers").show();

           }

        }
    });

    return MapView;
});
