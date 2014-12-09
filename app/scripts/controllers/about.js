'use strict';

/**
 * @ngdoc function
 * @name newestPetApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the newestPetApp
 */
angular.module('newestPetApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
