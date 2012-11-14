'use strict';

(function() {

    window.Gaz = {

        //Leaflet Style Definitions
        styles: {
            geojsonDefaultCSS: {
                    radius: 7,
                    fillColor: "#7CA0C7",
                    color: "#18385A",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.6
            },
            geojsonHighlightedCSS: {
                radius: 7,
                fillColor: '#F15913',
                color: '#f00',
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            },
            similarPlacesDefaultCSS: {
                radius: 6,
                fillColor: 'green',
                color: 'green',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.5
            },
            similarPlacesHighlightedCSS: {
                radius: 8,
                opacity: 1,
                weight: 1,
                fillOpacity: 1,
                color: '#000'
            }
        },

        //Common map definitions
        osmUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib: 'Map data © openstreetmap contributors',

        //api variables
        apiBase: '/1.0/place/',
        placeUrlPrefix: "/feature/"
    }

})();

