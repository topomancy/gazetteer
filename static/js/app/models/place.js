define(['Backbone', 'backbone_nested'], function(Backbone) {
    var Place = Backbone.NestedModel.extend({
        defaults: {
            geometry: {},
            properties: {

            }
        } 
    });
    return Place;
});

