define(['marionette', 'Backbone', 'jquery', 'app/core/mediator', 'app/helpers/search'], function(Marionette, Backbone, $, mediator, searchHelper) {
    var SearchView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchBlock',
        ui: {
            'form': '#searchForm',
            'q': '#q',
            'page': '#page',
            'start_date': '#start_date',
            'end_date': '#end_date',
            'feature_type': '#feature_type',
            'searchInBBox': '#searchInBBox',
            'applySearch': '#applySearch',
            'cancelSearch': '#cancelSearch',
            'resetSearch': '#resetSearch'
        },
        events: {
            'submit #searchForm': 'submitSearch',
            'click #applySearch': 'submitSearch',
            'keypress #q, #start_date, #end_date': 'formKeypress'
        },

        initialize: function() {
            this.bindUIElements();
        },
/*
        initialize: function() {
            console.log("searchview initialized");
            var that = this;
            mediator.events.on("test:event", function() {
                console.log("search view received test event");
            });
//            mediator.events.on("search:beforeFetch", function(searchParams) {
//                console.log("search view received search:beforeFetch with ", searchParams);
//                if (that.isSearchTrigger) {
//                    that.isSearchTrigger = false;
//                    return;
//                }
//                that.setSearchParams(searchParams);
//            });
        },
*/
        submitSearch: function(e) {
            e.preventDefault();
            this.setPage(1); //reset page no to 1 on a new search
            mediator.commands.execute("search:submit");
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
            console.log(e.keyCode);
            if (e.keyCode == 13) {
                this.submitSearch(e);
            }
        },

        getSearchParams: function() {
            var that = this;
            return {
                q: that.ui.q.val(),
                start_date: that.ui.start_date.val(),
                end_date: that.ui.end_date.val(),
                feature_type: that.ui.feature_type.val(),
                searchInBBox: that.ui.searchInBBox.is(":checked"),
                page: that.ui.page.val()
            };
        },
        setSearchParams: function(obj) {
            this.ui.q.val(obj.q);
            this.ui.page.val(obj.page);
            this.ui.start_date.val(obj.start_date);
            this.ui.end_date.val(obj.end_date);
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
