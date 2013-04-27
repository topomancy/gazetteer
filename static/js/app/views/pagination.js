define(['Backbone', 'marionette', 'jquery', 'underscore', 'text!app/views/pagination.tpl'], function(Backbone, Marionette, $, _, template) {

    var PaginationView = Marionette.Layout.extend({
        template: _.template(template),
        initialize: function(options) {
            this.collection = options.collection;
        },
        serializeData: function() {
            var that = this;
            return {
                'totalPages': that.collection.totalPages,
                'totalResults': that.collection.totalResults
            }
        },
         

    });

    return PaginationView;
});
