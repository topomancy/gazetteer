define(['marionette', 'Backbone', 'jquery', 'app/core/mediator'], function(Marionette, Backbone, $, mediator) {
    var HeaderView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchToggle',
        ui: {
            'searchLink': '#searchLink',
        },
        events: {
            // 'click #searchLink': 'toggleSearch',
            'click #loginBtn': 'openLoginModal'
        },

        initialize: function() {
            this.bindUIElements();
        },

/*        toggleSearch: function() {
            //console.log("toggle search");
            $('#searchToggleBlock').slideToggle();
        },
*/
        openLoginModal: function() {
            mediator.commands.execute("showModal", "login");    
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
