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
            this.listenTo(mediator.events, "navigate", function(section) {
                switch (section) {
                    case 'results':
                        that.showResults();
                        //that.selectResults();
                        break;
                    case 'place':
                        that.showPlace();
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
            app.results.$el.show();
            $(window).scrollTop(app.ui_state.resultsScroll);
            app.views.map.showResults();
            var qstring = app.results.currentView.collection.getQueryString();
            app.router.navigate('#search' + qstring);
            this.selectResults();
            console.log("showResults called");
        },

        showPlace: function() {
            var app = require('app/app');
            this.closeOpenTab();
            /*if (app.results.$el && app.results.$el.is(':visible')) {
                app.results.$el.hide();
            } */
            app.placeDetail.$el.show();
            app.views.map.showPlace();
            var url = app.placeDetail.currentView.model.get("permalink");
            app.router.navigate(url);
            this.selectPlace();
            console.log("showPlace called");
        },

        closeOpenTab: function() {
            var openTabName = this.getOpenTabName();
            console.log("open tab name", openTabName);
            if (openTabName === 'results') {
                app.ui_state.resultsScroll = $(window).scrollTop();
            }
            $('.mainContentTab').hide();
        },
       
        getOpenTabName: function() {
            return this.$el.find('.active').attr("data-name");        
        }, 
        unselectCurrent: function() {
            this.$el.find('.active').removeClass('active');
        },

        selectResults: function() {
            if (!this.ui.showResults.is(":visible")) {
                this.ui.showResults.show();
            }
            this.unselectCurrent();
            this.ui.showResults.addClass('active');
        },

        selectPlace: function() {
            if (!this.ui.showPlace.is(":visible")) {
                this.ui.showPlace.show();
            }
            this.unselectCurrent();
            this.ui.showPlace.addClass('active');
        }

    });
    
    return NavigationView;
});
