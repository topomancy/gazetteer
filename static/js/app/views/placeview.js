define(['Backbone', 'marionette', 'jquery', 'app/core/mediator', 'text!app/views/placeview.tpl'], function(Backbone, Marionette, $, mediator, template) {

    var PlaceView = Marionette.ItemView.extend({
        //'el': $('.place'),
        'tagName': 'div',
        'className': 'place',
        //'template': template,
        'events': {
            'click h2': 'goToPlace',
            'mouseover h2': 'mouseOverPlace',
            'mouseout h2': 'mouseOutPlace'
        },

        'template': _.template(template),

        'goToPlace': function(e) {
            app = require('app/app');
            //console.log("gotoplace called");
            //e.preventDefault();
            var id = this.model.attributes.properties.id;
            app.router.navigate("detail/" + id, {'trigger': true});             
        },
        'mouseOverPlace': function() {
            console.log("place moused over");
            mediator.commands.execute("highlightPlace", this.model);
        },
        'mouseOutPlace': function() {
            mediator.commands.execute("unhighlightPlace", this.model);
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
