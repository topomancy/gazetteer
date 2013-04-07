define(['require', 'jquery', 'app/core/mediator'], function(require, $, mediator) {

    var AjaxHelper = function() {
        this.ajax = function(url, data, type, success_callback, error_callback) {

            $.ajax({
                type: type,
                dataType: 'json',
                data: data,
                success: success_callback,
                error: error_callback 

            });
        }; 

    };

    return new AjaxHelper();
});
