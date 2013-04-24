define(['jquery', 'app/core/mediator', 'app/collections/places', 'app/views/placesview', 'app/views/layouts/results', 'app/views/placedetail', 'app/models/place', 'require'], function($, mediator, Places, PlacesView, ResultsLayout, PlaceDetailView, Place, require) { 
    return {
        "home": function() {
            console.log("home");
            
        },
        "search": function(queryString) {
            var app = require("app/app");
            console.log("search route called");
            var searchHelper = require("app/helpers/search");
            var queryJSON = searchHelper.queryStringToJSON(queryString);
            var places = new Places().setServerApi(queryJSON);
            mediator.commands.execute("search:updateUI", queryJSON);
            places.fetch({
                success: function() {
                    //FIXME: move to mediator commands?
                    //var placesView = new PlacesView({'collection': places});
                    var resultsLayout = new ResultsLayout({'collection': places});
                    app.content.show(resultsLayout);
                    //resultsLayout.places.show(placesView);
                }
            });
        },
        "detail": function(id, tab) {
            console.log(id);
            if (typeof(tab) == 'undefined') {
                tab = false;
            }
            var app = require("app/app");
            console.log("app required");
            var url = "/1.0/place/" + id + ".json";
            console.log(url);
            $.getJSON(url, {}, function(geojson) { //FIXME: should be ajax utils or so
                var place = new Place(geojson);
                mediator.commands.execute("openPlace", place, tab);
                //var detailView = new PlaceDetailView({'model': place});
                //app.content.show(detailView);
                //app.views.map.showPlace(place);
            });
        }
    }   

});
