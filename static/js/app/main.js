define(['Backbone','domReady','jquery', 'app/views/placesview', 'app/collections/places'], function(Backbone,domReady,$, PlacesView, Places) {

    domReady(function() {
        console.log("started");
        console.log(Places);
        var places = new Places();
        places.fetch();
        GLOB = places;
        return places;
    });


});

//define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
//  domReady ()->
//    console.log "started"
//    places = new Places
//    places.fetch()
    
    
