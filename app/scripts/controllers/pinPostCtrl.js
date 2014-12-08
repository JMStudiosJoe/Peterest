'use strict';

/**
 * @ngdoc function
 * @name se165PetPinterestWebApp.controller:PinPostCtrl
 * @description
 * # PinPostCtrl
 * Controller of the se165PetPinterestWebApp
 */
var app = angular.module('peterestApp');

app.controller('PinPostCtrl', function ($scope, $window, $interval)
{

    var user = Parse.User.current();
    $scope.username = user.get('username');
    $scope.boardList = [];
    $scope.boardListParse = [];
    $scope.myBoard = $scope.boardList[0];

    /** do not remove does continuous refresh of page to show items**/
    var c = 0;
    $scope.message="This DIV is refreshed "+c+" time.";
    $interval(function(){
        $scope.message="This DIV is refreshed "+c+" time.";
        c++;
    },1000);
    /**************************************************************/

    $scope.getMyBoards = function()
    {
        var relation = user.relation('myBoards');
        var queryMyBoards = relation.query();
        $scope.boardList = [];
        queryMyBoards.find(
            {
                success: function (results)
                {

                    $scope.boardListParse = results;
                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++)
                    {

                        var object = results[i];

                        $scope.boardList.push({
                            postID: object.id,
                            name: object.get('name'),
                            description: object.get('description'),
                            createdBy: object.get('createdBy'),
                            objectBad: object
                        });
                    }


                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });
    };

    $scope.pinPost = function()
    {
        var currentUser = Parse.User.current();
        if (currentUser)
        {

            console.log('AM I EVEN BEING CALLED???');
            $scope.boardName = angular.element(document.getElementById('boardName')).val();
            $scope.postDescription = angular.element(document.getElementById('postDescription')).val();

            var selectedBoardPinPost = $scope.boardListParse[$scope.boardName];

            var badObjectStorage = selectedBoardPinPost.relation('posts');

            var relationToBoardPosts = selectedBoardPinPost.relation('posts');
            relationToBoardPosts.add($scope.viewPostParse);
            //var viewPostID = $scope.viewPost.postID;

            var imageObject = $scope.viewPostParse.get('image');
            var image = imageObject.url();

            selectedBoardPinPost.set('displayImage', image);


            //console.log(relationToBoardPosts);
            selectedBoardPinPost.save(
                {
                    success: function(post)
                    {
                        console.log('The save was successful.' + post);

                    },
                    error: function(post, error)
                    {
                        console.warn(error);
                    }
                });
        }
        else
        {
            console.log('Need to login a user');
            // show the signup or login page
        }

    };

    $scope.getMyBoards();
});