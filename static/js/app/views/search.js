define(['marionette', 'Backbone', 'jquery', 'app/core/mediator', 'app/settings', 'app/helpers/search', 'app/views/origins', 'nouislider'], function(Marionette, Backbone, $, mediator, settings, searchHelper, OriginsView) {
    var SearchView = Marionette.Layout.extend({
        el: '#searchBlock',
        ui: {
            'form': '#searchForm',
            'q': '#q',
            'page': '#page',
            'start_date': '#start_date',
            'end_date': '#end_date',
            'timeSlider': '.noUiSlider',
            'feature_type': '#feature_type',
            'searchInBBox': '#searchInBBox',
            'applySearch': '#applySearch',
            'loadingSearch': '#loadingSearch',
            'cancelSearch': '#cancelSearch',
            'resetSearch': '#resetSearch',
            'checkedOriginsNumber': '.checkedOriginsNumber'
        },
        events: {
            'submit #searchForm': 'submitSearch',
            'click #applySearch': 'submitSearch',
            'click #showOrigins': 'toggleOrigins',
            'keypress #q, #start_date, #end_date': 'formKeypress'
        },
        regions: {
            'origins': '#originsRegion'
        },

        initialize: function() {
            var app = require('app/app');
            this.bindUIElements();
            this.listenTo(app.collections.origins, 'change', this.updateOriginsNumber);
        },
        render: function() {
            var that = this,
                minYear = settings.minYear,
                maxYear = settings.maxYear;
            this.ui.timeSlider.noUiSlider({
                range: [minYear, maxYear],
                start: [minYear, maxYear],
                handles: 2,
                step: 1,
                serialization: {
                    to: [that.ui.start_date, that.ui.end_date],
                    resolution: 1
                }
            });
            

            return this;
        },
        showOrigins: function() {
            var app = require('app/app');
            var that = this;
            var originsView = new OriginsView({'collection': app.collections.origins});
            this.origins.show(originsView);
            $(window).on('click', function() {
                that.hideOrigins();
            });
        },
        updateOriginsNumber: function() {
            var app = require('app/app');
            var number = app.collections.origins.getChecked().length;
            if (number > 0) {
                this.ui.checkedOriginsNumber.text(number);
            } else {
                this.ui.checkedOriginsNumber.text('');
            }
        },

        hideOrigins: function() {
            this.origins.close();
            $(window).off('click'); //FIXME: turn off only this click handler
        },
        toggleOrigins: function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.origins.currentView) {
                this.hideOrigins();
            } else {
                this.showOrigins();
            }
        },
        submitSearch: function(e) {
            e.preventDefault();
            this.setPage(1); //reset page no to 1 on a new search
            mediator.commands.execute("search:submit");
        },
        doLoading: function() {
            this.ui.applySearch.hide();
            this.ui.loadingSearch.show();    
        },
        stopLoading: function() {
            this.ui.applySearch.show();
            this.ui.loadingSearch.hide();
        },
        setPage: function(page) {
            this.ui.page.val(page);
        },

        setWithinBBox: function() {
            if (!this.ui.searchInBBox.is(":checked")) {
                this.ui.searchInBBox.attr("checked", "checked");
            }
        },

        formKeypress: function(e) {
            if (e.keyCode == 13) {
                this.submitSearch(e);
            }
        },

        getSearchParams: function() {
            var that = this,
                startDateVal = this.ui.start_date.val(),
                endDateVal = this.ui.end_date.val();
            if (startDateVal == settings.minYear && endDateVal == settings.maxYear) {
                var startDate = '';
                var endDate = '';
            } else {
                var startDate = startDateVal;
                var endDate = endDateVal;
            }
            return {
                q: that.ui.q.val(),
                start_date: startDate,
                end_date: endDate,
                feature_type: that.ui.feature_type.val(),
                searchInBBox: that.ui.searchInBBox.is(":checked"),
                page: that.ui.page.val()
            };
        },
        setSearchParams: function(obj) {
            if (obj.q) {
                this.ui.q.val(window.decodeURIComponent(obj.q));
            } else {
                this.ui.q.val('');
            }
            this.ui.page.val(obj.page);
            if (obj.start_date && obj.end_date) {
                this.ui.timeSlider.val([obj.start_date, obj.end_date]);    
            }
            //this.ui.start_date.val(obj.start_date);
            //this.ui.end_date.val(obj.end_date);
            this.ui.feature_type.val(obj.feature_type);
            if (obj.bbox) {
                this.ui.searchInBBox.attr("checked", "checked");
            } else {
                this.ui.searchInBBox.removeAttr("checked");
            }
            return this;
        }
    });        
    
    return SearchView;
});
