define(['Backbone', 'marionette', 'jquery', 'underscore', 'app/core/mediator', 'text!app/views/placedetail.tpl'], function(Backbone, Marionette, $, _, mediator, template) {
    var PlaceDetailView = Marionette.Layout.extend({
        className: 'placeDetail',
        template: _.template(template),
        regions: {
            'tab': '#detailTabContainer',
            'recentPlaces': '#recentlyViewedPlaces'
        },
        events: {
            'click .tabButton a': 'clickTab'
        },
        clickTab: function(e) {
            e.preventDefault();
            var tab = $(e.currentTarget).attr("data-tab");
            console.log("clicked tab", tab);
            this.showTab(tab);
        },
        showTab: function(tab) {
            var that = this;
            var app = require('app/app');
            var place = this.model;
            app.router.navigate('detail/' + place.id + '/' + tab);
            console.log('showTab', tab);
            switch (tab) {

                case 'alternateNames':
                    require([
                        'app/views/tabs/altnames',
                        'app/collections/alternate_names',
                    ], function(AlternateNamesView, AlternateNamesCollection) {
                        var altNamesArr = place.get('properties.alternate');
                        if (!altNamesArr) {
                            altNamesArr = [];
                        }
                        var alternateNames = new AlternateNamesCollection(altNamesArr);
                        var view = new AlternateNamesView({'collection': alternateNames});
                        that.tab.show(view);
                    });
                    break;

                case 'revisions':
                    require([
                        'app/views/tabs/revisions',
                        'app/collections/revisions',
                    ], function(RevisionsView, RevisionsCollection) {
                        that.model.getRevisions(function(revisions) {
                            var revisions = new RevisionsCollection(revisions);
                            console.log("revs", revisions);
                            var view = new RevisionsView({'collection': revisions});
                            that.tab.show(view);
                        }); 
                    });
                    break;

                case 'relations':

                    break;

                case 'adminBoundaries':
                    require([
                        'app/views/tabs/admin_boundaries',
                        'app/collections/admin_boundaries'
                    ], function(AdminBoundariesView, AdminBoundariesCollection) {
                        var admins = that.model.get('properties.admin');
                        if (!admins) {
                            var admins = [];
                        }
                        var admins = new AdminBoundariesCollection(admins);
                        var view = new AdminBoundariesView({'collection': admins});
                        that.tab.show(view);
                    });
                    break;
            }

        }
    });

    return PlaceDetailView;

});
