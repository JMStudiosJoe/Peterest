'use strict';

/**
 * @ngdoc overview
 * @name peterestApp
 * @description
 * # peterestApp
 *
 * Main module of the application.
 */
angular
  .module('peterestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider.when('/signup', {
        templateUrl: 'signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
