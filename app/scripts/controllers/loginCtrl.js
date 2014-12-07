'use strict';

/**
 * @ngdoc function
 * @name peterestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the peterestApp
 */
var app = angular.module('peterestApp');

app.controller('LoginCtrl', function ($scope, $location)
{
    $scope.test = 'test login controller';
    $scope.loginUser = function () {
        var username = angular.element(document.querySelector('#login_username'));
        var password = angular.element(document.querySelector('#login_password'));

        console.log(username.val() + ':::' + password.val());

        Parse.User.logIn(username.val(), password.val(),
            {
                success: function (user)
                {
                    $location.path('/signup');
                    $location.replace();
                    console.log($location.path());
                    window.location.href = '../views/dashboard.html';

                },
                error: function (user, error)
                {
                    // The login failed. Check error to see why.
                    alert("Incorrect username or password");
                    console.log('incorrect username or password' + error.message);

                }
            });
    };
});
