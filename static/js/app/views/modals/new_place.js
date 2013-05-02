define(['marionette', 'jquery', 'underscore', 'app/core/mediator', 'text!app/views/modals/new_place.tpl'], function(Marionette, $, _, mediator, template) {
    var NewPlaceView = Marionette.ItemView.extend({
        className: 'modalContent',
        template: _.template(template),
        events: {
            'submit #newPlaceForm': 'submitForm'
        },
        ui: {
            'name': '#newPlaceName',
            'type': '#newPlaceType',
            'isComposite': '#isComposite',
            'message': '.message'
        },

        submitForm: function(e) {
            e.preventDefault();
            var that = this;
            var name = this.ui.name.val();
            var type = this.ui.type.val();
            var isComposite = this.ui.isComposite.is(":checked");
            var placeGeoJSON = {
                "geometry": {},
                "type": "Feature",
                "properties": {
                    "importance": null,
                    "feature_code": type,
                    "id": null,
                    "population": null,
                    "is_composite": isComposite,
                    "name": name,
                    "area": null,
                    "admin": [],
                    "is_primary": true,
                    "alternate": null,
                    "feature_code_name": "", 
                    "timeframe": {}, 
                    "uris": []
                }
            };
            /* var placeObj  =  {
                "relationships": [],
                "admin": [], 
                "name": name,
                "geometry": {}, 
                "is_primary": true,
                "uris": [], 
                "feature_code": type,
                "centroid": [], 
                "timeframe": {}, 
                "is_composite": isComposite
            }; */
            var data = JSON.stringify(placeGeoJSON);
            console.log(data);
            $.ajax({
                'type': 'POST',
                'dataType': 'json',
                'url': '/1.0/place.json',
                'data': data,
                'success': function(response) {
                    if (response.error) {
                        that.ui.message.text(response.error); 
                    } else {
                        require(['app/models/place'], function(Place) {
                            var place = new Place(response);
                            console.log(place);
                            mediator.commands.execute("closeModal");
                            mediator.commands.execute("openPlace", place);
                        });
                    }
                }    
            });
        }    

    });    

    return NewPlaceView;
});