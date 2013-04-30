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
        Triggered when user logs in through login modal. Is listened to by views that need to display differently for logged in users
    */ 
    events.on("login", function(user) {
        var app = require('app/app');
        app.user = user;
    });

    requests.addHandler("getPlace", function(id) {
        var app = require('app/app');
        if (app.collections.places && app.collections.places.get(id)) {
            return app.collections.places.get(id);
        }
        if (app.content.currentView && app.content.currentView.model.id === id) {
            return app.content.currentView.model;
        }
        return false;   
    });

    requests.addHandler("isResultsView", function() {
        var app = require('app/app');
        return app.results.$el && app.results.$el.is(":visible");
    });

    requests.addHandler("isBBoxSearch", function() {
        var app = require('app/app');
        return app.views.search.ui.searchInBBox.is(":checked");
    });

    /*
        Used to highlight a place object on the map, for eg when mousing over a place result
    */
    commands.addHandler("map:highlight", function(place) {
        var app = require('app/app');
        app.views.map.highlight(place);   
    });

    commands.addHandler("getPlaceAsync", function(id, callback) {
        var place = requests.request("getPlace", id);
        if (place) {
            callback(place);
        } else {
            require(['app/models/place'], function(Place) {
                var url = "/1.0/place/" + id + ".json";
                console.log(url);
                $.getJSON(url, {}, function(geojson) { //FIXME: should be ajax utils or so
                    var place = new Place(geojson);
                    callback(place);
                });
            });
        }
            
    });

    /*
        Unhighlight place, eg. when mouse-out
    */
    commands.addHandler("map:unhighlight", function(place) {
        var app = require('app/app');
        app.views.map.unhighlight(place);
    });


    commands.addHandler("map:zoomTo", function(place) {
        var app = require('app/app');
        app.views.map.zoomTo(place);

    });

    /*
        Update Search UI when navigating from a URL
    */
    commands.addHandler("search:updateUI", function(queryObj) {
        var app = require('app/app');
        app.views.search.setSearchParams(queryObj);
        if (queryObj.bbox) {
            app.views.map.setBBox(queryObj.bbox);
        }
    });

    /*
        Submit a new search, gets search URL from Search Helper, and navigates to it, triggering the route.
    */
    commands.addHandler("search:submit", function() {
        var app = require('app/app');
        //app.views.header.hideSearch();
        app.router.navigate(app.helpers.search.getSearchURL(), {'trigger': true});
    });

    /*
        Load search results GeoJSON on map, called when places collection fetches result, before parsing
    */
    commands.addHandler("map:loadSearchResults", function(geojson) {
        var app = require('app/app');
        app.views.map.loadSearchResults(geojson);

    });

    commands.addHandler("search:setPage", function(page) {
        var app = require('app/app');
        app.views.map.userMovedMap = true;
        app.views.search.setPage(page);
    });

    commands.addHandler("search:setWithinBBox", function() {
        var app = require('app/app');
        app.views.search.setWithinBBox();
    });

    commands.addHandler("map:showResults", function() {
        var app = require('app/app');
        app.views.map.showResults();

    });

    commands.addHandler("showModal", function(type, options) {
        require(['app/helpers/modal'], function(modalHelper) {
            modalHelper.showModal(type, options);
        });
    });

    commands.addHandler("closeModal", function() {
        require(['app/helpers/modal'], function(modalHelper) {
            modalHelper.closeModal();
        });
    });

    /*
        Responsible for displaying place detail view and rendering / zooming into on map, optionally passed a tab name to display
    */
    commands.addHandler("openPlace", function(place, tab) {
        var app = require('app/app');
        app.collections.recentPlaces.add(place);
        var PlaceDetailView = require('app/views/placedetail');
        console.log("openPlace", place);
        var view = new PlaceDetailView({'model': place});
        app.content.show(view); 
        if (app.results.$el && app.results.$el.is(':visible')) {
            app.results.$el.hide();
        }
        app.content.$el.show();
        if (tab) {
            view.showTab(tab);
        }
        app.router.navigate(place.get("permalink"));
        app.views.map.loadPlace(place);
    });

    return {
        'events': events,
        'commands': commands,
        'requests': requests
    };

}); 
