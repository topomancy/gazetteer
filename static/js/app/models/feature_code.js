define(['Backbone'], function(Backbone) {

    var FeatureCode  = Backbone.Model.extend({
        initialize: function() {
            this.set('checked', false);
        }
    });

    return FeatureCode;
});
