define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/tabs/existing_relation.tpl', 'text!app/views/tabs/relations.tpl'], function(Backbone, Marionette, _, mediator, existingRelationTemplate, template) {
/*
    var SearchRelationView = Marionette.ItemView.extend({
        className: 'similarPlaces',
        template: _.template(searchRelationTemplate)
    });

    var SearchRelationsView = Marionette.CollectionView.extend({
        className: 'searchSimilarWrapper',
        itemView: SearchRelationView
    }); 
*/
    var ExistingRelationView = Marionette.ItemView.extend({
        className: 'similarPlaces',
        template: _.template(existingRelationTemplate)
    }); 

    var ExistingRelationsView = Marionette.CollectionView.extend({
        className: 'existingRelationsWrapper',
        itemView: ExistingRelationView
    });

    var RelationsView = Marionette.Layout.extend({
        className: 'similarBlock',
        template: _.template(template),
        regions: {
            'existing': '.existingRelationsRegion',
//            'search': '#searchSimilarRegion'
        },
        onRender: function() {
            var that = this;
            require([
                'app/collections/existing_relations',
 //               'app/collections/search_relations',
            ], function(ExistingRelations) {
                //var searchRelations = new SearchRelations();
                //var searchRelationsView = new SearchRelationsView({'collection': searchRelations});
                //that.search.show(searchRelationsView);
                that.model.getRelations(function(relations) {
                    //console.log("relations received", relations);
                    mediator.commands.execute("map:loadRelations", relations);
                    var existingRelations = new ExistingRelations(relations.features);
                    var existingRelationsView = new ExistingRelationsView({'collection': existingRelations});
                    that.existing.show(existingRelationsView);  
                });                
            });
        },

        onClose: function() {
            mediator.commands.execute("map:removeRelations");
        }
    });

    return RelationsView;
}); 
