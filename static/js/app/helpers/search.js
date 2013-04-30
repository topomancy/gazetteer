define(['Backbone', 'jquery', 'app/core/mediator', 'require'], function(Backbone, $, mediator, require) {
    var SearchHelper = function() {
        
        this.queryStringToJSON = function(qstring) {
            if (qstring.indexOf("?") == -1) {
                return {};
            }
            var q = qstring.split("?")[1];
            var args = {};
            var vars = q.split('&');
        //    console.log(vars);
            for (var i=0; i<vars.length; i++) {
                var kv = vars[i].split('=');
                var key = kv[0];
                var value = kv[1];
                args[key] = value;
            }		
            return args; 
        };

        this.JSONToQueryString = function(obj) {
            var s = "?";
            for (var o in obj) {
                if (obj.hasOwnProperty(o) && obj[o] !== '') {
                    s += o + "=" + obj[o] + "&";
                }
            }
            return s.substring(0, s.length - 1);
        };

        this.getSearchParams = function() {
            var app = require("app/app");
            console.log("get search params ", app);
            var params = app.views.search.getSearchParams();
            if (params.searchInBBox) {
                params.bbox = app.views.map.getBBoxString();
            }
            delete(params.searchInBBox);
            console.log(params);
            return params;
        };

        this.getSearchURL = function() {
            var searchObj = this.getSearchParams();
            return "search" + this.JSONToQueryString(searchObj);
        };
    };        

    return new SearchHelper();

});
