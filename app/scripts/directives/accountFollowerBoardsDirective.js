/**
 * Created by josephrichardson on 12/5/14.
 */
'use strict';

var app = angular.module('peterestApp');

app.directive('followerBoard', function()
{
    return {
        restrict: 'E',
        templateUrl: '../views/directives/accountFollowerBoardsDirective.html'

    };
});
