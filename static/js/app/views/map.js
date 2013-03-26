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
            console.log("mapview initialized");
            mediator.events.on("test:event", function() {
                console.log("map view received test event");
            });
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
            return this;
        }

    });
        

    console.log(L);
    return MapView;
});
