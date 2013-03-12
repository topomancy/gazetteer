define(['Backbone','app/models/place','app/collections/places','jquery','text!app/views/placeview.tpl'], function(Backbone, Place, Places, $, template) {

    var PlaceView = Backbone.View.extend({
        'tagName': 'div',
        'className': 'place',
        'initialize': function() {
            this.template = _.template(template); 
            return this;           
        },
        'render': function() {
            var that = this;
            console.log("rendering model", that.model);
            this.$el.append($(that.template(that.model.toJSON())));
            console.log(this.$el);
            return this;
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
