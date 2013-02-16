define ['Backbone','cs!app/models/place','cs!app/collections/places','jquery','cs!app/views/placeview'],(Backbone,Place,Places,$,PlaceView) ->
  class PlacesView extends Backbone.View
    className: 'places'
    initialize: ->
      _.bindAll @,'render'
      #@collection.bind 'reset',@render
    render: ->
      @collection.each (place) =>
        console.log place
        view = new PlaceView
          model:Place
          collection:@collection
        @$el.append view.render().el
      @
