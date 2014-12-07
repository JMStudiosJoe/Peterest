/**
 * Created by josephrichardson on 12/5/14.
 */
'use strict';

var app = angular.module('peterestApp');

app.directive('myPosts', function()
{
    return {
        restrict: 'E',
        templateUrl: '../views/directives/accountMyPostListDirective.html'

    };
});
