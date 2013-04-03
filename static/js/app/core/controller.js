define(['jquery', 'app/core/mediator', 'app/collections/places', 'app/views/placesview', 'app/views/placedetail', 'app/models/place', 'require'], function($, mediator, Places, PlacesView, PlaceDetailView, Place, require) { 
    return {
        "home": function() {
            console.log("home");
            
        },
        "search": function(queryString) {
            var app = require("app/app");
            //console.log("app", app);
            var searchHelper = require("app/helpers/search");
            var queryJSON = searchHelper.queryStringToJSON(queryString);
            var places = new Places().setServerApi(queryJSON);
            mediator.commands.execute("search:updateUI", queryJSON);
            places.fetch({
                success: function() {
                    var placesView = new PlacesView({collection: places});
                    app.content.show(placesView);
                    //app.views.places = placesView;
                    //mediator.events.trigger("search:afterFetch");
                }
            });
        },
        "detail": function(id) {
            console.log(id);
            var app = require("app/app");
            console.log("app required");
            var url = "/1.0/place/" + id + ".json";
            console.log(url);
            $.getJSON(url, {}, function(geojson) { //FIXME: should be ajax utils or so
                var place = new Place(geojson);
                mediator.commands.execute("openPlace", place);
                //var detailView = new PlaceDetailView({'model': place});
                //app.content.show(detailView);
                //app.views.map.showPlace(place);
            });
        }
    }   

});
