define(['marionette', 'jquery', 'underscore', 'text!app/views/modals/login.tpl'], function(Marionette, $, _, template) {
    var LoginView = Marionette.ItemView.extend({
        template: _.template(template),
        events: {
            'submit #formLogin': 'submitForm'
        },
        ui: {
            'username': '#username',
            'password': '#password'
        },

        submitForm: function(e) {
            e.preventDefault();
            var that = this;
            var username = this.ui.username.val();
            var password = this.ui.password.val();
/*            $.ajax({
                

            }); */
        }    

    });    

    return LoginView;
});
