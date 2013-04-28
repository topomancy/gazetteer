define(['Backbone', 'marionette', 'app/views/recentplace'], function(Backbone, Marionette, RecentPlace) {
    var RecentPlacesView = Marionette.CollectionView.extend({
        itemView: RecentPlace,
        tagName: 'ul',
        className: 'recentlyViewedPlaces',
        initialize: function() {
            this.collection.on("add", this.render);
        }
    });

    return RecentPlacesView;

});
