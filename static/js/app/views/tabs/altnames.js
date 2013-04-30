define(['Backbone', 'marionette', 'underscore', 'text!app/views/tabs/altnames.tpl'], function(Backbone, Marionette, _, template) {


    var AlternateNameView = Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template(template)
    }); 

    var AlternateNamesView = Marionette.CollectionView.extend({
        tagName: 'ul',
        className: 'searchResultsList alternateNamesList',
        itemView: AlternateNameView
    });

    return AlternateNamesView;
}); 
