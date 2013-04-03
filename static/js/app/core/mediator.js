define(['Backbone', 'marionette', 'require', 'app/settings'], function(Backbone, Marionette, require, settings) {
    var events = new Backbone.Wreqr.EventAggregator(),
        commands = new Backbone.Wreqr.Commands(),
        requests = new Backbone.Wreqr.RequestResponse();


    /*
        If we are in debug mode, log all events on the mediator to console
    */
    if (settings.debug) {
        events.on("all", function(eventType) {
            console.log("event fired: ", eventType);
        });
    }
    

    /*
        Used to highlight a place object on the map, for eg when mousing over a place result
    */
    commands.addHandler("map:highlight", function(place) {
        var app = require('app/app');
        app.views.map.highlight(place);   
    });

    /*
        Unhighlight place, eg. when mouse-out
    */
    commands.addHandler("map:unhighlight", function(place) {
        var app = require('app/app');
        app.views.map.unhighlight(place);
    });


    /*
        Update Search UI when navigating from a URL
    */
    commands.addHandler("search:updateUI", function(queryObj) {
        var app = require('app/app');
        app.views.search.setSearchParams(queryObj);
    });

    /*
        Submit a new search, gets search URL from Search Helper, and navigates to it, triggering the route.
    */
    commands.addHandler("search:submit", function() {
        var app = require('app/app');
        app.router.navigate(app.helpers.search.getSearchURL(), {'trigger': true});
    });

    /*
        Load search results GeoJSON on map, called when places collection fetches result, before parsing
    */
    commands.addHandler("map:loadGeoJSON", function(geojson) {
        var app = require('app/app');
        app.views.map.loadGeoJSON(geojson);

    });

    /*
        Responsible for displaying place detail view and rendering / zooming into on map
    */
    commands.addHandler("openPlace", function(place) {
        var app = require('app/app');
        var PlaceDetailView = require("app/views/placedetail");
        console.log("openPlace", place);
        var view = new PlaceDetailView({'model': place});
        app.content.show(view); 
        app.views.map.loadPlace(place);
    });

    return {
        'events': events,
        'commands': commands,
        'requests': requests
    }

}); 
