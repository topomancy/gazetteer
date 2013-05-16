define(['Backbone', 'app/models/existing_relation'], function(Backbone, ExistingRelation) {

    var ExistingRelations = Backbone.Collection.extend({
        model: ExistingRelation,
        getRelation: function(place) {
            if (this.get(place.id)) {
                return this.get(place.id);
            }
            return false;    
        }

    });

    return ExistingRelations; 

});
