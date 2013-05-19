define(['require', 'jquery'], function(require, $) {

   var ModalHelper = function() {
        this.showModal = function(type, options) {
            //console.log("showModal", type, options);
            switch (type) {

                case "login":
                    require(['app/app', 'app/views/modals/login'], function(app, LoginView) {
                        var view = new LoginView();
                        app.modal.show(view);    
                    });
                    break;

                case "logout":
                    require(['app/app', 'app/views/modals/logout'], function(app, LogoutView) {
                        var view = new LogoutView();
                        app.modal.show(view);    
                    });
                    break;

                case "newPlace":
                    require(['app/app', 'app/views/modals/new_place'], function(app, NewPlaceView) {
                        var view = new NewPlaceView();
                        app.modal.show(view);
                    });
                    break;

                case "savePlace":
                    require(['app/app', 'app/views/modals/save_place'], function(app, SavePlaceView) {
                        var model = options.model;
                        var view = new SavePlaceView({'model': model});
                        app.modal.show(view);
                    });
                    break;

                case "revert":
                    require(['app/app', 'app/views/modals/revert_place'], function(app, RevertPlaceView) {
                        var view = new RevertPlaceView({
                            'revision': options.revision,
                            'place': options.place
                        });
                        app.modal.show(view);
                    });
                    break;

                case "relate":
                    require(['app/app', 'app/views/modals/relate_places'], function(app, RelatePlacesView) {
                        var view = new RelatePlacesView(options);
                        app.modal.show(view);
                    });
                    break;

                case "delete_relation":
                    require(['app/app', 'app/views/modals/delete_relation'], function(app, DeleteRelationView) {
                        var view = new DeleteRelationView(options);
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
