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
            'click .zoomOnMap': 'zoomOnMap'
        },

        'template': _.template(template),

        'goToPlace': function(e) {
            e.preventDefault();
            app = require('app/app');
            var id = this.model.attributes.properties.id;
            app.router.navigate("detail/" + id);             
            mediator.commands.execute("openPlace", this.model);
        },
        'mouseOverPlace': function() {
            console.log("place moused over");
            mediator.commands.execute("map:highlight", this.model);
        },
        'mouseOutPlace': function() {
            mediator.commands.execute("map:unhighlight", this.model);
        },
        'zoomOnMap': function(e) {
            e.preventDefault();
            mediator.commands.execute("map:zoomTo", this.model);
        }
        
    });

    return PlaceView;

});
