define(['require', 'jquery'], function(require, $) {

   var ModalHelper = function() {
        this.showModal = function(type, options) {
            console.log("showModal", type, options);
            switch (type) {
                case "login":
                    require(['app/app', 'app/views/modals/login'], function(app, LoginView) {
                        var view = new LoginView();
                        app.modal.show(view);    
                    });
                    break;
                case "newPlace":
                    require(['app/app', 'app/views/modals/new_place'], function(app, NewPlaceView) {
                        var view = new NewPlaceView();
                        app.modal.show(view);
                    });
                    break;

            }
            this.displayModal();
        };

        this.closeModal = function() {
            var that = this;
            require(['app/app', 'jquery'], function(app, $) {
                app.modal.close();
                $('#overlay').hide();
                that.removeCloseHandler();
            });
        };

        this.displayModal = function() {
            $('#overlay').show();
            this.addCloseHandler();
        };

        this.addCloseHandler = function() {
            var that = this;
            $('#overlay').bind('click', function() {
                that.closeModal();
            });
            $('#lightBoxContent').bind('click', function(e) {
                e.stopPropagation();
            });
        };

        this.removeCloseHandler = function() {
            $('#overlay').unbind('click');
            $('#lightBoxContent').unbind('click');
        };

    }; 

    return new ModalHelper();
});
