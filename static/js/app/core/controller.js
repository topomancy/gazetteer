define(['marionette', 'require'], function(Marionette, require) { 
    return {
        "home": function() {
            console.log("home");
        },
        "search": function(queryParams) {
            console.log(queryParams);
        },
        "detail": function(id) {
            console.log(id);
        }
    }   

});
