define(['marionette', 'Backbone', 'jquery', 'underscore', 'app/core/mediator'], function(Marionette, Backbone, $, _, mediator) {
    var HeaderView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchToggle',
        ui: {
            'searchLink': '#searchLink',
            'loginButtons': '.loginButtons',
            'loggedInMsg': '.loggedInMsg'
        },
        events: {
            // 'click #searchLink': 'toggleSearch',
            'click #loginBtn': 'openLoginModal'
        },

        initialize: function() {
            var app = require('app/app');
            var that = this;
            this.bindUIElements();
            if (!_.isEmpty(app.user)) {
                this.loginUser(app.user);
            }
            mediator.events.on('login', function(user) {
                that.loginUser(user);
            });
        },

/*        toggleSearch: function() {
            //console.log("toggle search");
            $('#searchToggleBlock').slideToggle();
        },
*/
        openLoginModal: function() {
            mediator.commands.execute("showModal", "login");    
        },


        loginUser: function(user) {
            this.ui.loginButtons.hide();
            this.ui.loggedInMsg.text("Logged in as " + user.username).show();     
        }
/*
        hideSearch: function() {
            $('#searchToggleBlock').slideUp();
        },

        showSearch: function() {
            $('#searchToggleBlock').slideDown();
        }
*/
    });
    
    return HeaderView;
});
