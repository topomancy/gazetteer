
describe("testing places", function() {
    
    var done = false,
        that = this;
    beforeEach(function() {
        require(['app/collections/places'], function(Places) {
            that.places = new Places();
            that.places.fetch();
            that.places.on("reset", function() {
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });
    });

    
    it("should fetch 100 places", function() {
        expect(that.places.length).toEqual(100);
    });

});


