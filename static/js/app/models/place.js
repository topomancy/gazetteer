define(['jquery', 'Backbone', 'backbone_nested'], function($, Backbone) {
    var Place = Backbone.NestedModel.extend({
        defaults: {
            geometry: {},
            properties: {

            }
        },

        initialize: function() {
            console.log(this);
            this.set('display', this.getDisplayVars());
            this.set('originURL', this.getCleanOriginURL());
        }, 


        getDisplayVars: function() {
            return {
                'alternateNames': this.getAlternateNamesDisplay(),
                'origin': this.getOriginDisplay(),
                'timeframe': this.getTimeframeDisplay()
            };
        },

        getAlternateNamesDisplay: function() {
            if (this.get('properties.alternate_names')) {
                return this.get('properties.alternate_names').join(',');
            } else {
                return false;
            }
        },

        getOriginDisplay: function() {
            var cleanOriginURL = this.getCleanOriginURL();            
            var hostname = $('<a />').attr('href', cleanOriginURL).get(0).hostname;
            return hostname;
        },


        getTimeframeDisplay: function() {
            var timeframe = this.get('properties.timeframe');
            if (!timeframe) {
                return false;
            }
            if (timeframe.start && timeframe.end) {
                return timeframe.start + " - " + timeframe.end;
            }
            if (timeframe.start) {
                return timeframe.start;
            }
        },


        /*
            Adds 'http://' before the URL if it does not have it
        */
        getCleanOriginURL: function() {
            var uris = this.get('properties.uris');
            if (uris.length === 0) {
                return '';
            }
            var uri = uris[0];
            if (uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1) {
                return 'http://' + uri;
            } else {
                return uri;
            }
        },

        toGeoJSON: function() {
            return {
                'type': this.type,
                'geometry': this.geometry,
                'properties': this.properties
            }
        }
    });
    return Place;
});

