define(['Backbone', 'marionette', 'underscore', 'app/views/selectedplace', 'text!app/views/empty_selectedplaces.tpl', 'text!app/views/selectedplaces.tpl'], function(Backbone, Marionette, underscore, SelectedPlace, emptyViewTemplate, template) {

    var EmptySelectedPlacesView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: _.template(emptyViewTemplate),
    });

    var SelectedPlacesView = Marionette.CompositeView.extend({
        itemView: SelectedPlace,
        emptyView: EmptySelectedPlacesView,
        tagName: 'table',
        template: _.template(template),
        ui: {
            'thead': 'thead'
        },
        className: 'selectedPlaces searchResultsTable',
        appendHtml: function(collectionView, itemView) {
            collectionView.$("tbody").append(itemView.el);
        },
        initialize: function() {
            var that = this;
            this.listenTo(this.collection, "remove", function() {
                if (that.collection.length === 0) {
                    that.render();
                }    
            });
        },
        onRender: function() {
            this.checkEmpty();
        },
        checkEmpty: function() {
            if (this.collection.length === 0) {
                this.ui.thead.hide();
            } else {
                this.ui.thead.show();
            }
        }
    });

    return SelectedPlacesView;

});
