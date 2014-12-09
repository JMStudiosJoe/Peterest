'use strict';

/**
 * @ngdoc function
 * @name newestPetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newestPetApp
 */
angular.module('newestPetApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
