define(['Backbone', 'marionette', 'jquery', 'app/core/mediator', 'text!app/views/placedetail.tpl'], function(Backbone, Marionette, $, mediator, template) {
    var PlaceDetailView = Marionette.ItemView.extend({
        'className': 'placeDetail',
        'template': template 
    });

    return PlaceDetailView

});
