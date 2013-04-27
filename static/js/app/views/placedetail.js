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
        ui: {
            'editButtons': '.editButtons'
        },
        initialize: function() {
            var that = this;
            mediator.events.on('login', function(user) {
                that.showEdit();    
            });
        },
        onRender: function() {
            var that = this;
            var app = require('app/app');
            if (_.isEmpty(app.user)) {
                this.hideEdit();
            } else {
                this.showEdit();
            }
        },
        templateHelpers: {
            'getUser': function() {
                var app = require('app/app');
                if (!_.isEmpty(app.user)) {
                    return app.user;
                } else {
                    return false;
                }
            }
        },
        showEdit: function() {
            this.ui.editButtons.show();
        },
        hideEdit: function() {
            this.ui.editButtons.hide();
        },
        clickTab: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var tab = $target.attr("data-tab");
            console.log("clicked tab", tab);
            this.showTab(tab);
        },
        showTab: function(tab) {
            var that = this;
            var app = require('app/app');
            var place = this.model;
            app.router.navigate('detail/' + place.id + '/' + tab);
            var $button = this.$el.find('a[data-tab=' + tab + ']');
            this.$el.find('.active').removeClass("active");
            $button.parent().addClass("active");
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
                            _.each(revisions, function(revision) {
                                revision.model_id = that.model.id;
                            });
                            var revisions = new RevisionsCollection(revisions);
                            console.log("revs", revisions);
                            var view = new RevisionsView({'collection': revisions});
                            that.tab.show(view);
                        }); 
                    });
                    break;

                case 'relations':
                    require([
                        'app/views/tabs/relations'
                    ], function(RelationsView) {
                        var view = new RelationsView({'model': that.model});
                        that.tab.show(view);
                    });
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
