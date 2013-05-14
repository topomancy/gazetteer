define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/selectedplace.tpl'], function(Backbone, Marionette, _, mediator, template) {

    var SelectedPlaceView = Marionette.ItemView.extend({
        template: _.template(template),
        tagName: 'li',
        events: {
            'click .viewPlaceDetail': 'openPlace',
            'click .unselect': 'unselect'
        },

        openPlace: function(e) {
            var that = this;
            e.preventDefault();
            mediator.commands.execute("openPlace", that.model);
        },

        unselect: function(e) {
            e.preventDefault();
            mediator.commands.execute("unselectPlace", this.model);
        }
    });

    return SelectedPlaceView;
});
