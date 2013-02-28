define(['Backbone','app/models/place','app/collections/places','jquery','app/views/placeview'], function(Backbone, Place, Places, $, PlaceView) {

    var PlacesView = Backbone.View.extend({
        'className': 'places',
        'initialize': function() {
            _.bindAll(this, 'render');
        },

        'render': function() {
            var that = this;
            this.collection.each(function(place) {
                console.log(place);
                var view = new PlaceView({
                    'model': Place,
                    'collection': this.collection
                });
                that.$el.append(view.render().$el);
            });
        }
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
