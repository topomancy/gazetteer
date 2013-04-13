define(['Backbone', 'marionette', 'jquery', 'underscore', 'app/core/mediator', 'text!app/views/placedetail.tpl'], function(Backbone, Marionette, $, _, mediator, template) {
    var PlaceDetailView = Marionette.Layout.extend({
        'className': 'placeDetail',
        'template': _.template(template) 
    });

    return PlaceDetailView;

});
