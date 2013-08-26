define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/tabs/existing_relation.tpl', 'text!app/views/tabs/existing_relations.tpl', 'text!app/views/tabs/empty_relation.tpl', 'text!app/views/tabs/relations.tpl'], function(Backbone, Marionette, _, mediator, existingRelationTemplate, existingRelationsTemplate, emptyRelationTemplate, template) {
    var ExistingRelationView = Marionette.ItemView.extend({
        tagName: 'tr',
        className: 'similarPlaces',
        template: _.template(existingRelationTemplate),
        ui: {
            'removeRelation': '.removeRelation'
        },
        events: {
            'click .removeRelation': 'removeRelation',
            'mouseover': 'highlightPlace',
            'mouseout': 'unhighlightPlace'
        },
        initialize: function() {
            this.listenTo(mediator.events, 'login', this.showEdit);
            this.listenTo(mediator.events, 'logout', this.hideEdit);
        },
        onRender: function() {
            var user = mediator.requests.request("getUser");
            if (user) {
                this.showEdit();
            } else {
                this.hideEdit();
            }
        },
        removeRelation: function() {
            var that = this;
            var opts = {
                place1: mediator.requests.request("getCurrentPlace"),
                place2: this.model,
                relation: this.model.get('properties.relation_type'),
                callee: 'relationView'
            };
            opts.place1.deleteRelation(opts, function() {
                GLOB = that;        
                that.model.collection.remove(that.model);
            });
            //mediator.commands.execute("showModal", "delete_relation", opts);
        },
        showEdit: function() {
            this.ui.removeRelation.show();
        },
        hideEdit: function() {
            this.ui.removeRelation.hide();
        },
        highlightPlace: function() {
            mediator.commands.execute("map:highlight", this.model, "relationsLayer");
        },
        unhighlightPlace: function() {
            mediator.commands.execute("map:unhighlight", this.model, "relationsLayer");
        },
        goToPlace: function(e) {
            e.preventDefault();
            mediator.commands.execute("openPlace", this.model);
        }
    }); 

    var EmptyRelationView = Marionette.ItemView.extend({
        template: _.template(emptyRelationTemplate)
    });

    var ExistingRelationsView = Marionette.CompositeView.extend({
        tagName: 'table',
        className: 'existingRelationsWrapper tabTable',
        template: _.template(existingRelationsTemplate),
        itemView: ExistingRelationView,
        emptyView: EmptyRelationView,
        appendHtml: function(collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        },
    });


    /*
        Layout view to hold all relation views (can be refactored since now we only have an existing relations region).
    */
    var RelationsView = Marionette.Layout.extend({
        className: 'similarBlock',
        template: _.template(template),
        regions: {
            'existing': '.existingRelationsRegion',
        },
        onRender: function() {
            var that = this;
            require([
                'app/collections/existing_relations',
            ], function(ExistingRelations) {
                that.model.getRelations(function(relations) {
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
