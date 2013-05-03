define(['Backbone', 'marionette', 'underscore', 'text!app/views/tabs/admin_boundaries.tpl'], function(Backbone, Marionette, _, template) {


    var AdminBoundaryView = Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template(template)
    }); 

    var AdminBoundariesView = Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'searchResultsList adminBoundariesList',
        itemView: AdminBoundaryView
    });

    return AdminBoundariesView;
}); 
