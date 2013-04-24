define(['Backbone', 'app/models/existing_relation'], function(Backbone, ExistingRelation) {

    var ExistingRelations = Backbone.Collection.extend({
        model: ExistingRelation
    });

    return ExistingRelations; 

});
