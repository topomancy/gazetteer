define ['Backbone','cs!app/models/place','cs!app/collections/places','jquery','text!app/views/placeview.tpl'],(Backbone,Place,Places,$,template) ->
  class PlaceView extends Backbone.View
    tagName: 'div'
    className: 'place'
    initialize : ->
      _.bindAll @,'render'
      @template = _.template(template)
    render: ->
      console.log @template
      $(@el).append($(@template(@model.toJSON)))
      @
      
    
