define(['marionette', 'Backbone', 'jquery', 'underscore', 'app/core/mediator'], function(Marionette, Backbone, $, _, mediator) {
    var NavigationView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#tabNavigation',

        ui: {
            'showResults': '.showResults',
            'showPlace': '.showPlace',
        },

        events: {
            'click .showResults': 'showResults',
            'click .showPlace': 'showPlace'
            // 'click #searchLink': 'toggleSearch',
        },

        initialize: function() {
            var that = this;
            this.bindUIElements();
            
            this.listenTo(mediator.events, "selectTab", function(section) {
                switch (section) {
                    case 'results':
                        that.selectResultsTab();
                        //that.selectResults();
                        break;
                    case 'place':
                        that.selectPlaceTab();
                        //that.selectPlace();
                        break;
                }
            });
           
        },

        showResults: function() {
            var app = require('app/app');
            /*if (app.content.$el && app.content.$el.is(":visible")) {
                app.content.$el.hide();
            } */
            this.closeOpenTab();
            $('.activeContent').removeClass('activeContent').hide();
            app.results.$el.addClass("activeContent").show();
            $(window).scrollTop(app.ui_state.resultsScroll);
            app.views.map.showResults();
            var qstring = app.results.currentView.collection.getQueryString();
            app.router.navigate('#search' + qstring);
            this.selectResultsTab();
            console.log("showResults called");
        },

        showPlace: function() {
            var app = require('app/app');
            this.closeOpenTab();
            /*if (app.results.$el && app.results.$el.is(':visible')) {
                app.results.$el.hide();
            } */
            app.views.map.showPlace();
            $('.activeContent').removeClass('activeContent').hide();
            app.placeDetail.$el.addClass("activeContent").show();
            var url = app.placeDetail.currentView.model.get("permalink");
            app.router.navigate(url);
            this.selectPlaceTab();
            console.log("showPlace called");
        },

        closeOpenTab: function() {
            var app = require('app/app');
            var openTabName = this.getOpenTabName();
            console.log("open tab name", openTabName);
            if (openTabName === 'results') {
                app.ui_state.resultsScroll = $(window).scrollTop();
            }
            $('.mainContentTab').hide();
        },
       
        getOpenTabName: function() {
            return this.$el.find('.activeNav').attr("data-name");        
        }, 
        unselectCurrent: function() {
            this.$el.find('.activeNav').removeClass('activeNav');
        },

        selectResultsTab: function() {
            if (!this.ui.showResults.is(":visible")) {
                this.ui.showResults.show();
            }
            this.unselectCurrent();
            this.ui.showResults.addClass('activeNav');
        },

        selectPlaceTab: function() {
            if (!this.ui.showPlace.is(":visible")) {
                this.ui.showPlace.show();
            }
            this.unselectCurrent();
            this.ui.showPlace.addClass('activeNav');
        }

    });
    
    return NavigationView;
});
