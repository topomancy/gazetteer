define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/selectedplace.tpl'], function(Backbone, Marionette, _, mediator, template) {

    var SelectedPlaceView = Marionette.ItemView.extend({
        template: _.template(template),
        tagName: 'li',
        events: {
            'mouseover': 'mouseOverPlace',
            'mouseout': 'mouseOutPlace',
            'click .viewPlaceDetail': 'openPlace',
            'click .unselect': 'unselect',
            'click .zoomOnMap': 'zoomOnMap'
        },

        openPlace: function(e) {
            var that = this;
            e.preventDefault();
            mediator.commands.execute("openPlace", that.model);
        },

        unselect: function(e) {
            e.preventDefault();
            mediator.commands.execute("unselectPlace", this.model);
            mediator.commands.execute("map:zoomToLayer", 'selectedPlacesLayer');
        },

        mouseOverPlace: function() {
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:highlight", this.model, 'selectedPlacesLayer');
            }
        },

        mouseOutPlace: function() {
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:unhighlight", this.model, 'selectedPlacesLayer');
            }
        },

        zoomOnMap: function(e) {
            e.preventDefault();
            mediator.commands.execute("map:zoomTo", this.model);
        }

    });

    return SelectedPlaceView;
});
