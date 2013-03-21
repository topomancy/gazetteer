define(['Backbone', 'marionette', 'domReady','jquery', 'app/views/placesview', 'app/collections/places', 'app/core/router'], function(Backbone, Marionette, domReady,$, PlacesView, Places, GazRouter) {
    var app = new Marionette.Application();

    app.addInitializer(function() {
        //console.log("app inited");
        this.router = new GazRouter();
        Backbone.history.start();
    });   

    domReady(function() {
        app.start(); 


//        console.log("started");
//        console.log(Places);
//        var places = app.places = new Places();
//        places.on("reset", function() {
//            app.placesView.render();
//        });
//        app.placesView = new PlacesView({'collection': places});
//        //places.on("reset", view.render);
//        places.fetch();
//        //VIEW = view;
//        //GLOB = places;
//        return places;
    });

    
    return app;
});

//define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
//  domReady ()->
//    console.log "started"
//    places = new Places
//    places.fetch()
    
    
