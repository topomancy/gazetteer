define(['Backbone', 'marionette', 'app/models/place','app/collections/places', 'app/core/router', 'jquery','text!app/views/placeview.tpl'], function(Backbone, Marionette, Place, Places, router, $, template) {

    var PlaceView = Marionette.ItemView.extend({
        //'el': $('.place'),
        'tagName': 'div',
        'className': 'place',
        //'template': template,
        'events': {
            'click h2': 'goToPlace',
            'mouseover h2': 'mouseOverPlace'
        },

        'template': _.template(template),

        'goToPlace': function(e) {
            console.log("gotoplace called");
            //e.preventDefault();
            var id = this.model.id;
            router.navigate("detail/" + id, {'trigger': true});             
        },
        'mouseOverPlace': function() {
            console.log("place moused over");
        }
        
    });

    return PlaceView;

});




//define ['Backbone','cs!app/models/place','cs!app/collections/places','jquery','text!app/views/placeview.tpl'],(Backbone,Place,Places,$,template) ->
//  class PlaceView extends Backbone.View
//    tagName: 'div'
//    className: 'place'
//    initialize : ->
//      _.bindAll @,'render'
//      @template = _.template(template)
//    render: ->
//      console.log @template
//      $(@el).append($(@template(@model.toJSON)))
//      @
//      
//    
