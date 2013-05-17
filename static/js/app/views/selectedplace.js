define(['Backbone', 'marionette', 'underscore', 'app/settings', 'app/core/mediator', 'text!app/views/selectedplace.tpl'], function(Backbone, Marionette, _, settings, mediator, template) {

    var SelectedPlaceView = Marionette.ItemView.extend({
        template: _.template(template),
        tagName: 'li',
        events: {
            'mouseover': 'mouseOverPlace',
            'mouseout': 'mouseOutPlace',
            'click .viewPlaceDetail': 'openPlace',
            'click .unselect': 'unselect',
            'click .zoomOnMap': 'zoomOnMap',
            'click .relate': 'relatePlace',
            'click .stopRelate': 'stopRelatePlace',
            'change .relationType': 'showRelateModal'
        },
        ui: {
            'relate': '.relate',
            'stopRelate': '.stopRelate',
            'makeRelation': '.makeRelation',
            'relatingFrom': '.relatingFrom',
            'relationType': '.relationType',
            'confirmRelationBtn': '.confirmRelationBtn'
        },

        initialize: function() {
            this.isRelating = true;
        },

        templateHelpers: function() {
            return {
                'relationChoices': settings.relationChoices
            }    
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

        hideRelateBtn: function() {
            this.ui.relate.hide();
        },

        showRelateBtn: function() {
            this.ui.relate.show();
        },

        hideStopRelateBtn: function() {
            this.ui.stopRelate.hide();
        },

        showStopRelateBtn: function() {
            this.ui.stopRelate.show();
        },

        relateFrom: function(place, existingRelation) {
            this.ui.makeRelation.show();
            this.relatingFrom = {
                'place': place,
                'relation': existingRelation
            };
            this.ui.relatingFrom.text(place.get('properties.name'));
            console.log("existing relation", existingRelation);
            if (existingRelation) {
                this.ui.relationType.val(existingRelation);
            } else {
                this.ui.relationType.val('');
            } 
        },

        stopRelateFrom: function(place) {
            this.relatingFrom = false;
            this.ui.makeRelation.hide();
        },

        relatePlace: function(e) {
            e.preventDefault();
            var app = require('app/app');
            this.$el.addClass('relatingPlace');
            this.isRelating = true;
            this.hideRelateBtn();
            this.showStopRelateBtn();
            app.views.selectedPlaces.trigger('relatePlace', this.model);
        },

        stopRelatePlace: function(e) {
            e.preventDefault();
            var app = require('app/app');
            this.$el.removeClass('relatingPlace');
            this.isRelating = false;
            this.hideStopRelateBtn();
            this.showRelateBtn();
            app.views.selectedPlaces.trigger('stopRelatePlace', this.model);
        },

        showRelateModal: function(e) {
            var relType = this.ui.relationType.val();
            var that = this;
            if (this.relatingFrom.relation != relType) {
                var opts = {
                    'place1': that.relatingFrom.place,
                    'place2': that.model,
                    'relation': relType
                };
                if (relType != '') {
                    mediator.commands.execute("showModal", "relate", opts);
                } else {
                    console.log("delete relation");
                    mediator.commands.execute("showModal", "delete_relation", opts);
                }
                this.relatingFrom.relation = relType;
            }        
        },

        zoomOnMap: function(e) {
            e.preventDefault();
            mediator.commands.execute("map:zoomTo", this.model);
        }

    });

    return SelectedPlaceView;
});
