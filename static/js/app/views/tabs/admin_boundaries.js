define(['Backbone', 'marionette', 'underscore', 'text!app/views/tabs/admin_boundaries.tpl'], function(Backbone, Marionette, _, template) {


    var AdminBoundaryView = Marionette.ItemView.extend({
        tagname: 'li',
        template: _.template(template)
    }); 

    var AdminBoundariesView = Marionette.CollectionView.extend({
        tagName: 'ul',
        itemView: AdminBoundaryView
    });

    return AdminBoundariesView;
}); 
