define(['Backbone','domReady','jquery', 'app/views/placesview', 'app/collections/places'], function(Backbone,domReady,$, PlacesView, Places) {

    domReady(function() {
        console.log("started");
        console.log(Places);
        var places = new Places();
        var view = new PlacesView({'collection': places});
        //places.on("reset", view.render);
        places.fetch();
        VIEW = view;
        GLOB = places;
        return places;
    });

});

//define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
//  domReady ()->
//    console.log "started"
//    places = new Places
//    places.fetch()
    
    
