define(['Backbone', 'app/settings'], function(Backbone, settings) {

    var AdminBoundary  = Backbone.Model.extend({
        initialize: function() {
            this.set('url', this.getURL());
        },

        getURL: function() {
            if (this.get('id')) {
                return '/feature/' + this.get('id');
            }
            return false;
        }
    });

    return AdminBoundary;
});
