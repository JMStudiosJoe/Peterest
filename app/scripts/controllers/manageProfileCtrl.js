'use strict';

/**
 * @ngdoc function
 * @name se165PetPinterestWebApp.controller:Account
 * @description
 * #AccountCtrl
 * Controller of the se165PetPinterestWebApp
 */
var app = angular.module('peterestApp');


app.controller('ManageProfileCtrl', function($scope)
{


    var user = Parse.User.current();
    $scope.username = user.get('username');
    $scope.email = user.get('email');
    $scope.zipCode = user.get('zipCode');

    $scope.changeProfile = function() {
        var user = Parse.User.current();
        var newUserName = document.getElementById('user_name').value.trim();
        var newEmail = document.getElementById('email').value.trim(); // add validation & security
        var newZipCode = document.getElementById('zip_code').value.trim();

        if (newUserName != "")
            user.set('username', newUserName);
        if (newZipCode != "")
            user.set('zipCode', 95111);
        if (newEmail != "")
            user.set('email', newEmail);

        user.save(null, {
            success: function() { location.reload(true); }
        });
    }

    $scope.changePassword = function() {
        var user = Parse.User.current();
        var username = user.get('username');
        var oldPassword = document.getElementById('old_password').value;
        var newPassword = document.getElementById('new_password').value; // add validation & security
        var confirmPassword = document.getElementById('confirm_password').value;

        if (newPassword == confirmPassword) {
            var changePassword = Parse.User.logIn(username, oldPassword, {
                success: function(changePassword) {
                    document.getElementById('old_password').value = "";
                    document.getElementById('new_password').value = "";
                    document.getElementById('confirm_password').value = "";
                    changePassword.set('password', newPassword);
                    changePassword.save(null,
                        { success: function() { alert("Password changed!"); }},
                        { error: function(changePassword, error) { }}
                    );
                }
            });
        }
    }
});
