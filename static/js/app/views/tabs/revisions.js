define(['Backbone', 'marionette', 'underscore', 'text!app/views/tabs/revisions.tpl'], function(Backbone, Marionette, _, template) {


    var RevisionView = Marionette.ItemView.extend({
        tagname: 'li',
        template: _.template(template)
    }); 

    var RevisionsView = Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'reverseOrderedList',
        itemView: RevisionView
    });

    return RevisionsView;
}); 
