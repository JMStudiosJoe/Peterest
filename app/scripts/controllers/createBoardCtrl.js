/**
 * Created by josephrichardson on 12/6/14.
 */
'use strict';

/**
 * @ngdoc function
 * @name se165PetPinterestWebApp.controller:CreateBoardCtrl
 * @description
 * # CreateBoardCtrl
 * Controller of the se165PetPinterestWebApp
 */
var app = angular.module('peterestApp');

app.controller('CreateBoardCtrl', function ($scope, $window)
{

    $scope.createNewBoard = function()
    {
        console.log('Entered createNewBoard');

        var currentUser = Parse.User.current();
        if (currentUser)
        {
            //var likeCats = $scope.selectedCategoriesUserLikes;
            //var likeActions = $scope.selectedActionsUserLikes;

            // Simple syntax to create a new subclass of Parse.Object.
            //addPostContents_descriptionOfPost

            $scope.boardName = angular.element(document.getElementById('boardName')).val();
            $scope.boardDescription = angular.element(document.getElementById('boardDescription')).val();
            $scope.boardCategory = angular.element(document.getElementById('boardCategory')).val();

            console.log($scope.boardName + ';;;;;;  ');
            console.log('hahaha'+ $scope.boardDescription);
            console.log('category: '+ $scope.boardCategory);

            var Board = new Parse.Object.extend('Boards');
            var newBoard = new Board();
            newBoard.set('name', $scope.boardName);
            newBoard.set('description', $scope.boardDescription);
            newBoard.set('category', $scope.boardCategory);
            newBoard.set('createdBy', currentUser.attributes.username);

            newBoard.save(null, {
                success: function (newPost)
                {
                    // Execute any logic that should take place after the object is saved.
                    //alert('New object created with objectId: ' + newPost.id);

                    var relationToUserBoards = currentUser.relation('myBoards');

                    relationToUserBoards.add(newBoard);
                    currentUser.save();
                    $window.location.reload();
                },
                error: function (newPost, error)
                {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else
        {
            console.log('Need to login a user');
            // show the signup or login page
        }

    };
});