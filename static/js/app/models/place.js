define(['jquery', 'app/settings', 'underscore', 'Backbone', 'app/core/mediator', 'app/helpers/place', 'backbone_nested'], function($, settings, _, Backbone, mediator, helper) {
    var Place = Backbone.NestedModel.extend({
        defaults: {
            modelChanged: false,
            geometry: {},
            properties: {}
        },
        url: function() {
            return settings.api_base + 'place/' + this.id + '.json';
        },
//        idAttribute: 'properties.id',
        initialize: function() {
            //console.log(this);
            var that = this;
            this.id = this.get('properties.id'); //FIXME: is this safe? how else to set the 'id' from a nested property?
            this.set('display', this.getDisplayVars());
            this.set('originURL', this.getCleanOriginURL());
            this.set('geojsonURL', this.getGeojsonURL());
            this.set('permalink', this.getPermalink());
            this.set("currentFeatureName", this.get("properties.feature_code_name"));
            this.set("hasGeometry", this.hasGeometry());
            //this.set("wmsLayers", this.getWMSLayers());
            this.on("change", function() {
                this.set("display", this.getDisplayVars());
            });
            //this.set('geometry.coordinates', this.getCoords());
        }, 

        //convert coordinates to floats
        getCoords: function() {
            var coords = this.get('geometry.coordinates');
           
            
        },

        isSelected: function() {
            var app = require('app/app');
            return mediator.requests.request("place:isSelected", this)
        },

        hasGeometry: function() {
            return !_.isEmpty(this.get('geometry'));
        },

        getDisplayVars: function() {
            return {
                'admin': this.getAdminDisplay(),
                'alternateNames': this.getAlternateNamesDisplay(),
                'origin': this.getOriginDisplay(),
                'timeframe': this.getTimeframeDisplay(),
                //'updated': this.getUpdatedDisplay(),
                'feature_type': this.getFeatureTypeDisplay()
            };
        },

        getAdminDisplay: function() {
            var admin = this.get("properties.admin");
            if (!admin || admin.length === 0) {
                return '';
            }
            var admin_names = ""
            var name_array = ["","","","","", ""] //ADM0, ADM1, ADM2, ADM3, ADM4, others
            $.each(admin, function(i, admin) {
                if (admin.feature_code == "ADM0") {
                    name_array[0] = name_array[0] + " " + admin.name
                }else if (admin.feature_code == "ADM1"){
                    name_array[1] = name_array[1] + " " + admin.name
                }else if (admin.feature_code == "ADM2"){
                    name_array[2] = name_array[2] + " " + admin.name
                }else if (admin.feature_code == "ADM3"){
                    name_array[3] = name_array[3] + " " + admin.name
                }else if (admin.feature_code == "ADM4"){
                    name_array[4] = name_array[4] + " " + admin.name
                }else {
                    name_array[5] = name_array[5] + " " + admin.name
                }

            });
            name_array_clean = []
            $.each(name_array, function(i, name){
                if (name != ""){
                    name_array_clean.push(name)
                    }
            });

            $.each(name_array_clean.reverse(), function(i, name){
                var comma = ","
                if (i == 0) comma = ""
                admin_names = admin_names + comma + name
            }); 
            return admin_names
        },

        getAlternateNamesDisplay: function() {
            if (this.get('properties.alternate_names')) {
                return this.get('properties.alternate_names').join(',');
            } else {
                return false;
            }
        },

        getOriginDisplay: function() {
            var cleanOriginURL = this.getCleanOriginURL();            
            var hostname = $('<a />').attr('href', cleanOriginURL).get(0).hostname;
            return hostname;
        },


        getTimeframeDisplay: function() {
            var timeframe = this.get('properties.timeframe');
            if (!timeframe) {
                return false;
            }
            if (timeframe.start && timeframe.end) {
                return helper.getYear(timeframe.start) + " - " + helper.getYear(timeframe.end);
            }
            if (timeframe.start) {
                return helper.getYear(timeframe.start);
            }
        },

        getFeatureTypeDisplay: function() {
            return this.get('properties.feature_code_name');
            //return this.get('properties.feature_code') + ": " + this.get('properties.feature_code_name');
        },

        /*
            Adds 'http://' before the URL if it does not have it
        */
        getCleanOriginURL: function() {
            var uris = this.get('properties.uris');
            if (!uris || uris.length === 0) {
                return '';
            }
            var uri = uris[0];
            if (uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1) {
                return 'http://' + uri;
            } else {
                return uri;
            }
        },

        getGeojsonURL: function() {
            return settings.api_base + "place/" + this.get('properties.id') + ".json";
        },

        getPermalink: function() {
            return '#detail/' + this.id;
        },

        getRevisions: function(callback) {
            var that = this;
            if (this.get('revisions')) {
                callback(this.get('revisions'));
            } else {
                var url = settings.api_base + 'place/' + this.id + '/history.json';
                $.getJSON(url, {}, function(data) {
                    var revisions = data.revisions;
                    that.set('revisions', revisions);
                    callback(revisions);
                });
            }
        },

        getRelations: function(callback) {
            var that = this;
            if (this.get('relations')) {
                callback({'features': this.get('relations')});
            } else {
                var url = settings.api_base + 'place/' + this.id + '/relations.json';
                $.getJSON(url, {}, function(data) {
                    that.set('relations', data.features);
                    callback(data);
                });
            }
        },


        getWMSLayers: function() {
            var warperURLs = settings.warperURLs;
            var wmsLayers = [];
            var uris = this.get('properties.uris');
            _.each(uris, function(uri) {
                _.each(warperURLs, function(warperURL) {
                    if (uri.indexOf(warperURL) != -1) {
                        var warperIdRegex = new RegExp(warperURL + "/warper/layers/([0-9]*)\..*");
                        var warperId = uri.match(warperIdRegex)[1];
                        var warperWMS = warperURL + "/warper/layers/wms/" + warperId;
                        wmsLayers.push(warperWMS);
                    }
                });
            });    
            //console.log(wmsLayers);
            return wmsLayers;
        },

        toGeoJSON: function() {
            return {
                'type': this.get('type'),
                'geometry': this.get('geometry'),
                'properties': this.get('properties')
            };
        }
    });
    return Place;
});

