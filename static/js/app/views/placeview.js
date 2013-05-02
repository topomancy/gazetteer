define(['Backbone', 'marionette', 'jquery', 'app/core/mediator', 'text!app/views/placeview.tpl'], function(Backbone, Marionette, $, mediator, template) {

    var PlaceView = Marionette.ItemView.extend({
        //'el': $('.place'),
        'tagName': 'li',
        //'template': template,
        'events': {
            'click h6': 'goToPlace',
            'click .viewPlaceDetail': 'goToPlace',
            'mouseover': 'mouseOverPlace',
            'mouseout': 'mouseOutPlace',
            'click .zoomOnMap': 'zoomOnMap',
            'click .editPlace': 'editPlace'
        },

        'template': _.template(template),

        'goToPlace': function(e) {
            e.preventDefault();
            app = require('app/app');
            mediator.commands.execute("openPlace", this.model);
        },
        'mouseOverPlace': function() {
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:highlight", this.model);
            }
        },
        'mouseOutPlace': function() {
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:unhighlight", this.model);
            }
        },
        'zoomOnMap': function(e) {
            e.preventDefault();
            mediator.commands.execute("map:zoomTo", this.model);
        },
       
        'editPlace': function(e) {
            e.preventDefault();
        } 
    });

    return PlaceView;

});
