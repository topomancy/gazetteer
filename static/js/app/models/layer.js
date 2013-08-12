define(['Backbone'], function(Backbone) {

    var Layer  = Backbone.Model.extend({
        initialize: function() {
           this.id = this.get('properties.id');
           this.set("isDisplayed", false);
           this.set("leafletLayer", null);
        }
    });

    return Layer;
});
