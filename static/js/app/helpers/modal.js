define(['require', 'jquery'], function(require, $) {

   var ModalHelper = function() {
        this.showModal = function(type, options) {
            
        };

        this.closeModal = function() {
            var that = this;
            require(['app/app', 'jquery'], function(app, $) {
                app.modal.close();
                $('#overlay').hide();
                that.removeCloseHandler();
            });
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
