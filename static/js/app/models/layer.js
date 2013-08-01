define(['Backbone'], function(Backbone) {

    var Layer  = Backbone.Model.extend({
        initialize: function() {
           this.id = this.get('properties.id');
        }
    });

    return Layer;
});
