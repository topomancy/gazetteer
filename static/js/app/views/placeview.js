define(['Backbone', 'marionette', 'jquery', 'app/core/mediator', 'text!app/views/placeview.tpl'], function(Backbone, Marionette, $, mediator, template) {

    var PlaceView = Marionette.ItemView.extend({
        'tagName': 'li',
        'events': {
            'click h6': 'goToPlace',
            'click .viewPlaceDetail': 'goToPlace',
            'mouseover': 'mouseOverPlace',
            'mouseout': 'mouseOutPlace',
            'click .zoomOnMap': 'zoomOnMap',
            //'click .editPlace': 'editPlace',
            'click .selectPlace': 'selectPlace'
        },
        'ui': {
            'selectPlace': '.selectPlace',
            'unselectPlace': '.unselectPlace'
            //'unselectPlaceBtn': '.unselectPlace'
        },

        'initialize': function() {
            var that = this;
            this.model.on('select', function() {
                that.placeSelected();
            });
            this.model.on('unselect', function() {
                that.placeUnselected();
            });
        },

        'onRender': function() {
            if (this.model.isSelected()) {
                this.placeSelected();
            }
        },

        'template': _.template(template),

        'templateHelpers': function() {
            return {
                'isSelected': this.model.isSelected()
            };
        },

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
        'selectPlace': function(e) {
            e.preventDefault();
            mediator.commands.execute("selectPlace", this.model);
        },
        'placeSelected': function() {
            this.ui.selectPlace.hide();
            this.ui.unselectPlace.show();
        },
        'placeUnselected': function() {
            this.ui.unselectPlace.hide();
            this.ui.selectPlace.show();
        } 
    });

    return PlaceView;

});
