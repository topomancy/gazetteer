define(['Backbone', 'marionette', 'domReady','jquery', 'app/views/placesview', 'app/collections/places'], function(Backbone, Marionette, domReady,$, PlacesView, Places) {
    var app = new Marionette.Application();    
    domReady(function() {
        console.log("started");
        console.log(Places);
        var places = app.places = new Places();
        places.on("reset", function() {
            app.placesView.render();
        });
        app.placesView = new PlacesView({'collection': places});
        //places.on("reset", view.render);
        places.fetch();
        //VIEW = view;
        //GLOB = places;
        return places;
    });

    
    return app;
});

//define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
//  domReady ()->
//    console.log "started"
//    places = new Places
//    places.fetch()
    
    
