define(['Backbone', 'marionette', 'underscore', 'text!app/views/tabs/existing_relation.tpl', 'text!app/views/tabs/search_relation.tpl', 'text!app/views/tabs/relations.tpl'], function(Backbone, Marionette, _, existingRelationTemplate, searchRelationTemplate, template) {

    var SearchRelationView = Marionette.ItemView.extend({
        className: 'similarPlaces',
        template: _.template(searchRelationTemplate)
    });

    var SearchRelationsView = Marionette.CollectionView.extend({
        className: 'searchSimilarWrapper',
        itemView: SearchRelationView
    }); 

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
            'existing': '#existingRelationsRegion',
            'search': '#searchSimilarRegion'
        },
        onRender: function() {
            console.log('relations view onRender');
            var that = this;
            require([
                'app/collections/existing_relations',
                'app/collections/search_relations',
            ], function(ExistingRelations, SearchRelations) {
                var searchRelations = new SearchRelations();
                var searchRelationsView = new SearchRelationsView({'collection': searchRelations});
                that.search.show(searchRelationsView);
                that.model.getRelations(function(relations) {
                    var existingRelations = new ExistingRelations(relations.features);
                    var existingRelationsView = new ExistingRelationsView({'collection': existingRelations});
                    that.existing.show(existingRelationsView);  
                });                
            });
        }
    });

    return RelationsView;
}); 
