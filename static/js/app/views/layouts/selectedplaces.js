define(['Backbone', 'marionette', 'underscore', 'jquery', 'app/core/mediator', 'app/collections/existing_relations', 'app/views/selectedplaces', 'text!app/views/layouts/selectedplaces.tpl'], function(Backbone, Marionette, _, $, mediator, ExistingRelations, SelectedPlacesView, template) {
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
            this.listenTo(this, 'relatePlace', this.relate);
            this.listenTo(this, 'stopRelatePlace', this.stopRelate);
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
            'click .zoomToLayer': 'zoomToLayer'       
        },

        showTab: function() {
            mediator.commands.execute("nav:showTab", "selected");
        },

        hideTab: function() {
            mediator.commands.execute("nav:hideTab", "selected");
            
        },

        relate: function(model) {
            //console.log("relate", model);
            var that = this;
            model.getRelations(function(relations) {
                var collectionView = that.places.currentView;
                var relationsCollection = new ExistingRelations(relations.features);
                collectionView.children.each(function(itemView) {
                    var thisModel = itemView.model;
                    if (thisModel.id !== model.id) {
                        itemView.hideRelateBtn();
                        var existingRelation = relationsCollection.getRelation(thisModel);
                        itemView.relateFrom(model, existingRelation ? existingRelation.get('properties.relation_type') : false); 
                    }
                });
            });
        },

        stopRelate: function(model) {
            var collectionView = this.places.currentView;
            collectionView.children.each(function(itemView) {
                var thisModel = itemView.model;
                if (thisModel.id !== model.id) {
                    itemView.showRelateBtn();
                    itemView.stopRelateFrom(model);
                }
            });
        },

        onRender: function() {
            var selectedPlacesView = new SelectedPlacesView({'collection': this.selectedCollection});
            this.places.show(selectedPlacesView);
        },

        zoomToLayer: function() {
            mediator.commands.execute("map:zoomToLayer", "selectedPlacesLayer");
        }
    });

    return SelectedPlacesLayout;
});
