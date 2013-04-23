define(['marionette', 'Backbone', 'jquery'], function(Marionette, Backbone, $) {
    var HeaderView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchToggle',
        ui: {
            'searchLink': '#searchLink',
        },
        events: {
            'click #searchLink': 'toggleSearch',
        },

        initialize: function() {
            this.bindUIElements();
        },

        toggleSearch: function() {
            //console.log("toggle search");
            $('#searchToggleBlock').slideToggle();
        },

        hideSearch: function() {
            $('#searchToggleBlock').slideUp();
        },

        showSearch: function() {
            $('#searchToggleBlock').slideDown();
        }

    });
    
    return HeaderView;
});
