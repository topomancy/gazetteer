define(['Backbone', 'marionette', 'jquery', 'app/views/map', 'app/views/search', 'app/core/router', 'app/core/mediator', 'app/helpers/search'], function(Backbone, Marionette, $, MapView, SearchView, GazRouter, mediator, searchHelper) {
    var app = new Marionette.Application({
        views: {},
        models: {},
        collections: {},
        mediator: mediator
    });

    
    app.addRegions({
        'map': '#mapBlock',
        'search': '#searchBlock',
        'content': '#mainContentBlock',
        //'results': '#resultsBlock'
    });
    


    app.mediator.events.on("search:updateSearch", function(searchParams) {
        console.log("app received updateSearch event ", searchParams);
        console.log(searchHelper.getSearchURL());
        app.router.navigate(searchHelper.getSearchURL(), {'trigger': true});
        //console.log(currentSearchParams);
    });

    app.on('initialize:after', function() {
        //console.log("app inited");
        app.views.map = new MapView().render();
        app.views['search'] = new SearchView();
        this.router = new GazRouter();
        Backbone.history.start();

    });   

//    domReady(function() {
//        app.start(); 


////        console.log("started");
////        console.log(Places);
////        var places = app.places = new Places();
////        places.on("reset", function() {
////            app.placesView.render();
////        });
////        app.placesView = new PlacesView({'collection': places});
////        //places.on("reset", view.render);
////        places.fetch();
////        //VIEW = view;
////        //GLOB = places;
////        return places;
//    });

    
    return app;
});

//define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
//  domReady ()->
//    console.log "started"
//    places = new Places
//    places.fetch()
    
    
