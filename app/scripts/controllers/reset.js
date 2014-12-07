/**
 * Created by josephrichardson on 12/5/14.
 */
'use strict';

/**
 * @ngdoc function
 * @name se165PetPinterestWebApp.controller:signupCtrl
 * @description
 * # signupCtrl
 * Controller of the se165PetPinterestWebApp
 */
var app = angular.module('peterestApp');
app.controller('ResetCtrl', function ($scope)
{
    $scope.test = 'in dashboard test';
    console.log("EMAIL: " + angular.element( document.querySelector( '#reset_email' ) ).val());
    $scope.resetPassword = function()
    {
        var email = angular.element( document.querySelector( '#reset_email' ) ).val();
        console.log("EMAIL: " + email);
        Parse.User.requestPasswordReset(email, {
            success: function() {
                alert("Reset email sent");
            },
            error: function(error) {
                // Show the error message somewhere
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };

});
