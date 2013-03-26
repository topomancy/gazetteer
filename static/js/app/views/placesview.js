define(['Backbone', 'marionette', 'app/models/place','app/collections/places','jquery','app/views/placeview'], function(Backbone, Marionette, Place, Places, $, PlaceView) {

    var PlacesView = Marionette.View.extend({
        'el': '#resultsBlock',
        //'className': 'places',
        'initialize': function() {
            _.bindAll(this, 'render');
            console.log("placesview init");
            console.log(this.$el);
            //console.log(this.collection);
            //this.collection.on("reset", this.render);
        },

        'render': function() {
            var that = this;
            console.log("render");
            that.$el.empty();
            this.collection.each(function(place) {
                //console.log(place);
                //console.log("foo");
                //console.log(this.collection);
                //console.log("place", place.toJSON());
                var view = new PlaceView({
                    'model': place,
                    //'collection': this.collection
                });
                
                that.$el.append(view.render().$el);
                //FOO = that.$el;
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
