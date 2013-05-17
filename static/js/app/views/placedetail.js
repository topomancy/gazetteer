define(['Backbone', 'marionette', 'jquery', 'underscore', 'app/settings', 'app/collections/revisions', 'app/core/mediator', 'text!app/views/placedetail.tpl', 'select2'], function(Backbone, Marionette, $, _, settings, Revisions, mediator, template) {
    var PlaceDetailView = Marionette.Layout.extend({
        className: 'placeDetail',
        template: _.template(template),
        regions: {
            'tab': '#detailTabContainer',
            'recentPlaces': '.recentPlaces',
        },
        events: {
            'click .tabButton a': 'clickTab',
            'click .savePlaceBtn': 'save',
            'click .cancelSaveBtn': 'cancel',
            'click .editName': 'editName',
            'click .confirmEditName': 'confirmEditName',
            'click .cancelEditName': 'cancelEditName',
            'click .editFeatureType': 'editFeatureType',
            'click .confirmEditFeatureType': 'confirmEditFeatureType',
            'click .cancelEditFeatureType': 'cancelEditFeatureType',
            'click .editTimeframe': 'editTimeframe',
            'click .confirmEditTimeframe': 'confirmEditTimeframe',
            'click .cancelEditTimeframe': 'cancelEditTimeframe',
            'click .selectPlace': 'selectPlace'
        },
        ui: {
            'editButtons': '.editIcon',
            'saveButtons': '.saveButtons',
            'selectPlace': '.selectPlace',
            'featureTypeInput': '#editFeatureTypeInput',
            'lastUpdated': '.lastUpdated',
            'timeFrameStart': '#timeframe_start',
            'timeFrameStartRange': '#timeframe_start_range',
            'timeFrameEnd': '#timeframe_end',
            'timeFrameEndRange': '#timeframe_end_range'
        },
        initialize: function() {
            var that = this;
            mediator.events.on('login', function(user) {
                that.showEdit();    
            });
            this.model.on('change:properties', function() {
                that.modelChanged();
            });
            this.model.on('change:geometry', function() {
                that.modelChanged();
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
            this.model.getRevisions(function(revs) {
                var revisions = new Revisions(revs);
                var mostRecent = revisions.last();
                var lastUpdated = mostRecent.getDisplayDate();
                that.ui.lastUpdated.text(lastUpdated);
            });
/*            require(['app/views/recentplaces'], function(RecentPlacesView) {
                var recentPlacesView = new RecentPlacesView({'collection': app.collections.recentPlaces});
                console.log("recent places view", recentPlacesView);
                that.recentPlaces.show(recentPlacesView);
            }); 
*/
        },
        templateHelpers: function() {
            var that = this;
            return {
                //user: mediator.requests.request("getUser"),
                isSelected: that.model.isSelected()
            }
        },

        selectPlace: function() {
            mediator.commands.execute("selectPlace", this.model);
        },

        placeSelected: function() {
            this.ui.selectPlace.hide();
        },

        placeUnselected: function() {
            this.ui.selectPlace.show();
        },

        showEdit: function() {
            this.ui.editButtons.show();
        },
        hideEdit: function() {
            this.ui.editButtons.hide();
        },
        initFeatureTypeAutocomplete: function() {
            var that = this;
            this.ui.featureTypeInput.select2({
                ajax: {
                    'url': settings.api_base + "place/feature_codes.json",
                    dataType: 'json',
                    quietMillis: 100,
                    data: function(term, page) {
                        return {
                            q: term,
                            page_limit: 10,
                            page: page
                        }
                    },
                    results: function(data, page) {
                        var more = data.has_next;
                        return {results: data.items, more: more};
                    }
                },
                formatResult: function(item) {
                    return "<div>" + item.cls + ":" + item.typ + " " + item.name + "<div style='font-size:12px'><i>" + item.description + "</i></div></div>"
                },
                formatSelection: function(item) {
                    that.model.set("currentFeatureName", item.name);
                    return item.typ + ": " + item.name;
                },
                initSelection: function(elem, callback) {
                    var val = $(elem).val();
                    var data = {
                        'id': val,
                        'typ': val,
                        'name': that.model.get('properties.feature_code_name')
                    };
                    callback(data);
                }
                
            });
        },
        destroyFeatureTypeAutocomplete: function() {
            this.ui.featureTypeInput.select2("destroy");
        },
        modelChanged: function() {
            var saveVisible = this.ui.saveButtons.is(':visible');
            if (!saveVisible) {
                this.ui.saveButtons.show();
            }    
        },
        editName: function(e) {
            e.preventDefault();
            var $container = $('.editName').closest('.placeDetailEach');
            this.showEditable($container);
            var currentName = this.model.get('properties.name');
            $('#editNameInput').val(currentName);
        },
        showEditable: function($container) {
            $container.find('.placeDetailResult').hide();
            $container.find('.editable').show();
            $container.find('.editIcon').hide();
        },
        hideEditable: function($container) {
            $container.find('.placeDetailResult').show();
            $container.find('.editable').hide();
            $container.find('.editIcon').show();
        },
        confirmEditName: function(e) {
            e.preventDefault();
            var newName = $('#editNameInput').val();
            this.model.set('properties.name', newName);
            var $container = $('.editName').closest('.placeDetailEach');
            $container.find('.placeDetailResult').text(newName);
            this.hideEditable($container);
        },

        cancelEditName: function() {
            var $container = $('.editName').closest('.placeDetailEach');
            this.hideEditable($container);
        },

        editFeatureType: function(e) {
            e.preventDefault();
            var $container = $('.editFeatureType').closest('.placeDetailEach');
            this.showEditable($container);
            this.initFeatureTypeAutocomplete();
        },

        confirmEditFeatureType: function(e) {
            var $container = $('.editFeatureType').closest('.placeDetailEach');
            var featureTypeCode = this.ui.featureTypeInput.select2("val");
            var featureTypeName = this.model.get("currentFeatureName");
            this.model.set("properties.feature_code", featureTypeCode);
            this.model.set("properties.feature_code_name", featureTypeName);
            $container.find('.placeDetailResult').text(this.model.get("display.feature_type"));
            this.hideEditable($container);
            this.destroyFeatureTypeAutocomplete(); 
        },

        cancelEditFeatureType: function(e) {
            var $container = $('.editFeatureType').closest('.placeDetailEach');
            this.hideEditable($container);
            this.model.set("currentFeatureName", this.model.get("properties.feature_code_name"));
            this.destroyFeatureTypeAutocomplete();
        },

        editTimeframe: function(e) {
            e.preventDefault();
            var $container = $('.editTimeframe').closest('.placeDetailEach');
            this.showEditable($container);
            this.setTimeframeEditablesFromModel();
        },

        confirmEditTimeframe: function(e) {
            e.preventDefault();
            this.setModelFromTimeframeEditables();
            var $container = $('.editTimeframe').closest('.placeDetailEach');
            this.hideEditable($container);
            $container.find('.placeDetailResult').text(this.model.get('display.timeframe'));
        },

        cancelEditTimeframe: function() {
            var $container = $('.editTimeframe').closest('.placeDetailEach');
            this.hideEditable($container);
        },

        setTimeframeEditablesFromModel: function() {
            console.log("ts", this.ui.timeFrameStart);
            this.ui.timeFrameStart.val(this.model.get('properties.timeframe.start'));
            this.ui.timeFrameStartRange.val(this.model.get('properties.timeframe.start_range')), //FIXME: ranges need special handling?
            this.ui.timeFrameEnd.val(this.model.get('properties.timeframe.end'));
            this.ui.timeFrameEndRange.val(this.model.get('proprties.timeframe.end_range'));   

        },

        setModelFromTimeframeEditables: function() {
            var timeFrame = {
                start: this.ui.timeFrameStart.val(),
                start_range: this.ui.timeFrameStartRange.val(),
                end: this.ui.timeFrameEnd.val(),
                end_range: this.ui.timeFrameEndRange.val()
            };
            this.model.set('properties.timeframe', timeFrame);
        },

        save: function() {
            var that = this;
            require(['app/helpers/modal'], function(modalHelper) {
                //take variables from form and make changes to model
                var model = that.model;
                modalHelper.showModal("savePlace", {'model': model});
                
            });
        },
        cancel: function() {
            mediator.commands.execute("openPlace", this.model);
        },
        clickTab: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var tab = $target.attr("data-tab");
            this.showTab(tab);
        },
        showTab: function(tab) {
            var that = this;
            var app = require('app/app');
            var place = this.model;
            app.router.navigate('detail/' + place.id + '/' + tab, {'replace': true});
            var $button = this.$el.find('a[data-tab=' + tab + ']');
            this.$el.find('.active').removeClass("active");
            $button.parent().addClass("active");
            switch (tab) {

                case 'alternateNames':
                    require([
                        'app/views/tabs/altnames',
                        'app/collections/alternate_names',
                    ], function(AlternateNamesLayout, AlternateNamesCollection) {
                        var altNamesArr = place.get('properties.alternate');
                        if (!altNamesArr) {
                            altNamesArr = [];
                        }
                        var alternateNames = new AlternateNamesCollection(altNamesArr, {'place': that.model});
                        var view = new AlternateNamesLayout({'collection': alternateNames, 'model': that.model});
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
