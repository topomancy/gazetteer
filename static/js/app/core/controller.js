define(['app/core/mediator', 'app/collections/places', 'app/views/placesview', 'require'], function(mediator, Places, PlacesView, require) { 
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
            mediator.events.trigger("search:beforeFetch", queryJSON);
            places.fetch({
                success: function() {
                    var placesView = new PlacesView({collection: places})
                    app.content.show(placesView);
                    //mediator.events.trigger("search:afterFetch");
                }
            });
        },
        "detail": function(id) {
            console.log(id);
        }
    }   

});
