define ['Backbone','domReady','jquery', 'cs!app/views/placesview', 'cs!app/collections/places'],(Backbone,domReady,$, PlacesView, Places)->
  domReady ()->
    console.log "started"
    places = new Places
    places.fetch()
    
    
