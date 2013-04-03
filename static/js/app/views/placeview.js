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
        }
        
    });

    return PlaceView;

});
