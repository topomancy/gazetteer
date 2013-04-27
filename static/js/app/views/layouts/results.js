define(['Backbone', 'marionette', 'underscore', 'jquery', 'text!app/views/layouts/results.tpl'], function(Backbone, Marionette, _, $, template) {
    var ResultsLayout = Marionette.Layout.extend({
        template: _.template(template),
        initialize: function(options) {
            this.collection = options.collection;
            console.log(options.collection);
            //console.log("set collection option", this.collection);
        },
        regions: {
            'places': '#searchResultsBlock',
            'pagination': '#paginationBlock'
        },

        serializeData: function() {
            return {
                'queryString': this.collection.server_api.q,
                'geojsonURL': this.collection.getGeojsonURL()
            }
        },
        onRender: function() {
            var that = this;
            require(['app/views/placesview'], function(PlacesView) {
                var placesView = new PlacesView({'collection': that.collection});
                that.places.show(placesView);
            });
            require(['app/views/pagination'], function(PaginationView) {
                var paginationView = new PaginationView({'collection': that.collection});
                that.pagination.show(paginationView);
            });
        }
    });

    return ResultsLayout;
});
