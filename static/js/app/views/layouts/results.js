define(['Backbone', 'marionette', 'underscore', 'jquery', 'app/core/mediator', 'text!app/views/layouts/results.tpl'], function(Backbone, Marionette, _, $, mediator, template) {
    var ResultsLayout = Marionette.Layout.extend({
        template: _.template(template),
        initialize: function(options) {
            this.collection = options.collection;
            console.log(options.collection);
            //console.log("set collection option", this.collection);
        },
        regions: {
            'places': '#searchResultsBlock',
            'pagination': '.pagBlock',
            'recentPlaces': '.recentPlaces'
        },
        events: {
            'click .newPlaceBtn': 'openNewPlaceModal'
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
            require(['app/app', 'app/views/recentplaces'], function(app, RecentPlacesView) {
                var recentPlacesView = new RecentPlacesView({'collection': app.collections.recentPlaces});
                that.recentPlaces.show(recentPlacesView);
            });
        },
        openNewPlaceModal: function() {
            mediator.commands.execute("showModal", "newPlace");            
        }
    });

    return ResultsLayout;
});
