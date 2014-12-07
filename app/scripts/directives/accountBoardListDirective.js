/**
 * Created by josephrichardson on 12/5/14.
 */
'use strict';

var app = angular.module('peterestApp');

app.directive('accBoardlist', function()
{
    return {
        restrict: 'E',
        templateUrl: '../views/directives/accountBoardListDirective.html'

    };
});
