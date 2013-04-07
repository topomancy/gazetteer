define(['Backbone', 'marionette', 'app/models/place','app/collections/places','jquery','app/views/placeview'], function(Backbone, Marionette, Place, Places, $, PlaceView) {

    var PlacesView = Marionette.CollectionView.extend({
        //'el': '#resultsBlock',
        'tagName': 'ul',
        'className': 'searchResultsList',
        'itemView': PlaceView
    });

    return PlacesView;
});

//define ['Backbone','cs!app/models/place','cs!app/collections/places','jquery','cs!app/views/placeview'],(Backbone,Place,Places,$,PlaceView) ->
//  class PlacesView extends Backbone.View
//    className: 'places'
//    initialize: ->
//      _.bindAll @,'render'
//      #@collection.bind 'reset',@render
//    render: ->
//      @collection.each (place) =>
//        console.log place
//        view = new PlaceView
//          model:Place
//          collection:@collection
//        @$el.append view.render().el
//      @
