define(['Backbone', 'app/settings', 'app/core/mediator', 'app/models/layer'], function(Backbone, settings, mediator, Layer) {

    var Layers = Backbone.Collection.extend({
        model: Layer,
        'type': 'GET',
        'dataType': 'json',
        "url" : function(){
             var query = this.getQueryString();
             return settings.api_base + 'place/layers.json' + query;   
        },
        'parse': function(res) {
            return res.items;
        },
        'server_api': {
        },
        'setServerApi': function(place) {
            var app = require('app/app');
            //var start_date = place.get('properties.timeframe').start.split("-")[0]
            //var end_date = place.get('properties.timeframe').start.split("-")[0]
            var bounds = app.views.map.getBounds().toBBoxString();
            this.server_api.bbox = bounds || "";
            //this.server_api.start_date = start_date || "";
            //this.server_api.end_date = end_date || "";

            return this;
        },
       'getQueryString': function() {
            var searchHelper = require("app/helpers/search");
            return searchHelper.JSONToQueryString(this.getQueryObj());
        },
       'getQueryObj': function() {
            var that = this;
            var queryAttributes = {};
            _.each(_.result(that, "server_api"), function(value, key){
                if( _.isFunction(value) ) {
                    value = _.bind(value, that);
                    value = value();
                }
                if (value) {
                    queryAttributes[key] = value;
                }
            });
            return queryAttributes;
        }
    });

    return Layers;

});

