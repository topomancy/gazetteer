define(['Backbone', 'marionette', 'underscore', 'jquery', 'app/core/mediator', 'app/views/selectedplaces', 'text!app/views/layouts/selectedplaces.tpl'], function(Backbone, Marionette, _, $, mediator, SelectedPlacesView, template) {
    var SelectedPlacesLayout = Marionette.Layout.extend({
        template: _.template(template),
        initialize: function(options) {
            var that = this;
            this.selectedCollection = options.selectedCollection;
            this.listenTo(this.selectedCollection, 'add', function() {
                if (that.selectedCollection.length == 1) {
                    that.showTab();
                }    
            });
            /*
            this.listenTo(this.selectedCollection, 'remove', function() {
                if (that.selectedCollection.length == 0) {
                    that.hideTab();
                }
            });
            */
            //this.listenTo(this.collection, 'change', this.render);
        },
        regions: {
            'places': '#selectedPlacesBlock',
        },
        events: {
       
        },

        showTab: function() {
            mediator.commands.execute("nav:showTab", "selected");
        },

        hideTab: function() {
            mediator.commands.execute("nav:hideTab", "selected");
            
        },

        onRender: function() {
            var selectedPlacesView = new SelectedPlacesView({'collection': this.selectedCollection});
            this.places.show(selectedPlacesView);
        }
    });

    return SelectedPlacesLayout;
});
