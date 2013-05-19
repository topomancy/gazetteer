define(['Backbone', 'marionette', 'jquery', 'app/core/mediator', 'text!app/views/placeview.tpl'], function(Backbone, Marionette, $, mediator, template) {

    var PlaceView = Marionette.ItemView.extend({
        'tagName': 'tr',
        'events': {
            'click': 'clickPlace',
            //'click h6': 'goToPlace',
            'click .viewPlaceDetail': 'goToPlace',
            'dblclick': 'goToPlace',
            'mouseover': 'mouseOverPlace',
            'mouseout': 'mouseOutPlace',
            'click .zoomOnMap': 'zoomOnMap',
            //'click .editPlace': 'editPlace',
            'click .selectPlace': 'selectPlace',
            'click .unselectPlace': 'unselectPlace'
        },
        'ui': {
            'selectPlace': '.selectPlace',
            'unselectPlace': '.unselectPlace',
            'actionIcons': '.actionIcons',
            'selectBtns': '.selectBtns',
            'viewPlaceDetail': '.viewPlaceDetail',
            'editPlaceDetail': '.editPlaceDetail'
            //'unselectPlaceBtn': '.unselectPlace'
        },

        'initialize': function() {
            var that = this;
            this.listenTo(mediator.events, 'login', this.doLogin); 
            this.listenTo(mediator.events, 'logout', this.doLogout);
            this.listenTo(this.model, 'select', this.placeSelected);
            this.listenTo(this.model, 'unselect', this.placeUnselected);
            this.iconsDisplayed = false;
        },

        'onRender': function() {
            var user = mediator.requests.request("getUser");
            if (user) {
                this.doLogin();
            }
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
            this.highlight();
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:highlight", this.model, 'resultsLayer');
            }
        },
        'mouseOutPlace': function() {
            this.unhighlight();
            if (this.model.get("hasGeometry")) {
                mediator.commands.execute("map:unhighlight", this.model, 'resultsLayer');
            }
        },
        'showIcons': function() {
            this.$el.addClass("iconsDisplayed");
            this.ui.actionIcons.show();
            this.iconsDisplayed = true;
        },
        'hideIcons': function() {
            this.$el.removeClass("iconsDisplayed");
            this.ui.actionIcons.hide();
            this.iconsDisplayed = false;
        },
        'highlight': function() {
            this.$el.addClass("highlightedPlace");
        },
        'unhighlight': function() {
            this.$el.removeClass("highlightedPlace");
        },
        'clickPlace': function() {
            mediator.events.trigger("clickedPlace", this.model);
            if (!this.iconsDisplayed) {
                this.showIcons();
            } else {
                this.hideIcons();
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
        'unselectPlace': function(e) {
            e.preventDefault();
            mediator.commands.execute("unselectPlace", this.model);
        },
        'placeSelected': function() {
            this.ui.selectPlace.hide();
            this.ui.unselectPlace.show();
        },
        'placeUnselected': function() {
            this.ui.unselectPlace.hide();
            this.ui.selectPlace.show();
        },
        'doLogin': function() {
            this.ui.selectBtns.show();
            this.ui.viewPlaceDetail.hide();
            this.ui.editPlaceDetail.show();
           
        },
        'doLogout': function() {
            this.ui.selectBtns.hide();
            this.ui.viewPlaceDetail.show();
            this.ui.editPlaceDetail.hide();
        } 
    });

    return PlaceView;

});
