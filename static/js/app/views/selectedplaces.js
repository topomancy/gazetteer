define(['Backbone', 'marionette', 'app/views/selectedplace'], function(Backbone, Marionette, SelectedPlace) {
    var SelectedPlacesView = Marionette.CollectionView.extend({
        itemView: SelectedPlace,
        tagName: 'ul',
        className: 'selectedPlaces searchResultsList',
    });

    return SelectedPlacesView;

});
