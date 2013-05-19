define(['marionette', 'Backbone', 'jquery', 'underscore', 'app/core/mediator'], function(Marionette, Backbone, $, _, mediator) {
    var NavigationView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#tabNavigation',

        ui: {
            'showResults': '.showResults',
            'showPlace': '.showPlace',
            'addPlaceBtn': '.addPlace'
        },

        events: {
            'click .showResults': 'showResults',
            'click .showPlace': 'showPlace',
            'click .showSelected': 'showSelected',
            'click .addPlace': 'addPlace'
            // 'click #searchLink': 'toggleSearch',
        },

        initialize: function() {
            var that = this;
            var app = require('app/app');
            this.bindUIElements();
            if (!_.isEmpty(app.user)) {
                this.showAddPlace();
            }
            this.listenTo(mediator.events, "selectTab", this.selectTab);
            this.listenTo(mediator.events, "login", this.showAddPlace);
            this.listenTo(mediator.events, "logout", this.hideAddPlace);
           
        },


        showResults: function() {
            /*if (app.content.$el && app.content.$el.is(":visible")) {
                app.content.$el.hide();
            } */
            if (this.getOpenTabName() === 'results') {
                return false;
            }
            var app = require('app/app');
            this.closeOpenTab();
            //$('.activeContent').removeClass('activeContent').hide();
            app.results.$el.addClass("activeContent").show();
            $(window).scrollTop(app.ui_state.resultsScroll);
            app.views.map.showResults();
            var qstring = app.results.currentView.collection.getQueryString();
            app.router.navigate('#search' + qstring);
            this.selectTab('results');
            console.log("showResults called");
        },

        showPlace: function() {
            if (this.getOpenTabName() === 'place') {
                return false;
            }
            var app = require('app/app');
            this.closeOpenTab();
            /*if (app.results.$el && app.results.$el.is(':visible')) {
                app.results.$el.hide();
            } */
            app.views.map.showPlace();
            //$('.activeContent').removeClass('activeContent').hide();
            app.placeDetail.$el.addClass("activeContent").show();
            var url = app.placeDetail.currentView.model.get("permalink");
            app.router.navigate(url);
            this.selectTab('place');
            console.log("showPlace called");
        },

        showSelected: function() {
            if (this.getOpenTabName() === 'selected') {
                return false;
            }
            var app = require('app/app');
            this.closeOpenTab();
            app.views.map.showSelectedPlaces();
            app.selectedPlaces.$el.addClass("activeContent").show();
            var url = "#selected";
            app.router.navigate(url);
            this.selectTab('selected');
        },

        closeOpenTab: function() {
            var app = require('app/app');
            var openTabName = this.getOpenTabName();
            console.log("open tab name", openTabName);
            if (openTabName === 'results') {
                app.ui_state.resultsScroll = $(window).scrollTop();
            }
            $('.activeContent').removeClass('activeContent').hide();
            //$('.mainContentTab').hide();
        },
       
        getOpenTabName: function() {
            return this.$el.find('.activeNav').attr("data-name");        
        }, 

        unselectCurrent: function() {
            this.$el.find('.activeNav').removeClass('activeNav');
        },


        getTab: function(name) {
            return this.$el.find('.tabButton[data-name=' + name + ']');
        },

        showTab: function(name) {
            var $tab = this.getTab(name);
            $tab.show();
        },

        hideTab: function(name) {
            var $tab = this.getTab(name);
            $tab.hide();
        },

        selectTab: function(name) {
            var $tab = this.getTab(name);
            if (!$tab.is(":visible")) {
                $tab.show();
            }
            this.unselectCurrent();
            $tab.addClass('activeNav');
        },

        showAddPlace: function() {
            this.ui.addPlaceBtn.show();
        },
        
        hideAddPlace: function() {
            this.ui.addPlaceBtn.hide();
        },

        addPlace: function(e) {
            e.preventDefault();
            mediator.commands.execute("showModal", "newPlace");
        } 

    });
    
    return NavigationView;
});
