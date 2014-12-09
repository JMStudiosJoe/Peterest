'use strict';

/**
 * @ngdoc function
 * @name peterestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the peterestApp
 */
var app = angular.module('peterestApp');

app.controller('SignupCtrl',['$scope', '$location', '$modal', function ($scope, $location, $modal)
{
    $scope.openCategory = function()
    {
        console.log("We're in the right place");
        console.log("$modal = ", $modal);
        $scope.modalInstance = $modal.open({templateUrl: "../views/directives/categoryModalDirective.html", controller: "modal_helper2", size: "lg"});
        console.log("modalInstance = ", $scope.modalInstance);
    };

    $scope.signupNewUser = function()
    {
        var name = angular.element( document.querySelector( '#signup_firstName' ) ).val();
        var lastName = angular.element( document.querySelector( '#signup_lastName' ) ).val();
        var username = angular.element( document.querySelector( '#signup_username' ) ).val();
        var password = angular.element( document.querySelector( '#signup_password' ) ).val();
        var confirmPassword = angular.element( document.querySelector( '#signup_confirmPassword' ) ).val();
        var zipCode = angular.element( document.querySelector( '#signup_zipCode' ) ).val();
        var email = angular.element( document.querySelector( '#signup_email' ) ).val();
        var alertFlag = false;
        var alertText = '';

        if(username.length >= 6 && password.length >= 6 && name.length !== 0 && lastName.length !== 0 && email.length !== 0 && zipCode.length !== 0)
        {
            if(confirmPassword === password)
            {

                var user = new Parse.User();
                user.set('name', name);
                user.set('username', username);
                user.set('password', password);
                user.set('email', email);
                user.set('zipCode', zipCode.number)

                user.signUp(null,
                    {
                        success: function(user)
                        {
                            $scope.openCategory();
                        },
                        error: function(user, error)
                        {
                            // Show the error message somewhere and let the user try again.
                            alertText = alertText + error.message + '. ';
                            alertFlag = true;
                            //alert(error.message);
                            //console.log('Error: ' + error.code + ' ' + error.message + ' ' + alertFlag + ' ' + alertText);
                        }
                    });
            }
            else
            {
                alertText = alertText + 'Passwords do not match. ';
                alertFlag = true;
                //alert('Passwords do not match');
            }
        }
        else
        {
            if(name.length === 0 || lastName.length === 0)
            {
                alertText = alertText + 'First name or last name empty. ';
                alertFlag = true;
                //alert('First name or last name empty');
            }
            if(username.length < 6 || password.length < 6)
            {
                alertText = alertText + 'Username or Password too short. ';
                alertFlag = true;
                //alert('Username or Password too short');
            }
            if(email.length === 0)
            {
                alertText = alertText + 'Email is empty. ';
                alertFlag = true;
                //alert('Email is empty');
            }
            if(zipCode.length === 0)
            {
                alertText = alertText + 'Zip Code is empty. ';
                alertFlag = true;
                //alert('Email is empty');
            }
        };

        if(alertFlag)
        {
            alert(alertText);
        }
    }

}]);

app.controller('modal_helper2', function ($location, $scope, $modalInstance)
{
    $scope.close_modal = function()
    {
        $modalInstance.close('cancel')
    };
});
