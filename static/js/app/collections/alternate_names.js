define(['Backbone', 'app/models/alternate_name'], function(Backbone, AlternateName) {

    var AlternateNames = Backbone.Collection.extend({
        model: AlternateName
    });

    return AlternateNames; 

});
