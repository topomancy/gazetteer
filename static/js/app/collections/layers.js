define(['Backbone', 'app/settings', 'app/core/mediator', 'app/models/layer'], function(Backbone, settings, mediator, Layer) {

    var Layers = Backbone.Collection.extend({
        model: Layer,
        'type': 'GET',
        'dataType': 'json',
        "url" : function(){
             var query = this.getQueryString();
             return settings.api_base + 'place/layers.json' + query;
            //return settings.api_base + 'place/layers.json?&bbox=-179.99,1.2303741774326145,-37.08984375,57.51582286553883&start_date=1700&end_date=1901';
        },
        'fetch': function(){

            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        'parse': function(res) {
            return res.items;
        },
        'server_api': {
        },
        'setServerApi': function(options) {
            this.server_api.bbox = options.bbox || "";
            this.server_api.start_date = options.start_date || "";
            this.server_api.end_date = options.end_date || "";
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

