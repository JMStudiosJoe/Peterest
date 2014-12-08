'use strict';

/**
 * @ngdoc function
 * @name se165PetPinterestWebApp.controller:PinPostCtrl
 * @description
 * # PinPostCtrl
 * Controller of the se165PetPinterestWebApp
 */
var app = angular.module('peterestApp');

app.controller('AccountCtrl', function ($scope, $window, $interval)
{
    var user = Parse.User.current();
    $scope.username = user.get('username');
    $scope.following = false;
    $scope.followers = false;

    $scope.likedPostList = [];
    $scope.likedPostListParse = [];
    $scope.myPostList = [];
    $scope.myPostListParse = [];
    $scope.followingList = [];
    $scope.followingListBoards = [];
    $scope.followingListFromParse = [];
    $scope.followersList = [];
    $scope.followersListBoards = [];
    $scope.followersListFromParse = [];
    $scope.boardList = [];



    $scope.postsInBoard = [];
    $scope.postsInBoardParse = [];
    $scope.viewPost = null;
    $scope.viewPostParse = null;


    $scope.showBoards = false;
    $scope.showPins = false;

    var c = 0;
    $scope.message="This DIV is refreshed "+c+" time.";
    $interval(function()
    {
        $scope.message="This DIV is refreshed "+c+" time.";
        c++;
    },1000);

    $scope.editUserCategoriesAndActions = function()
    {


        $scope.userLikedCategories = user.attributes.likedCategories;
        $scope.userLikedActions = user.attributes.likedActions;

        console.log('hello: ' + $scope.userLikedCategories.length + '\nactions liked: ' + $scope.userLikedActions);

    };
    $scope.clearLowerData = function()
    {
        $scope.showPins = false;
        $scope.showBoards = false;
    };
    $scope.getMyPosts = function()
    {
        var relation = user.relation('myPosts');
        var queryMyPosts = relation.query();
        $scope.myPostList = [];
        $scope.myPostListParse = [];
        queryMyPosts.find(
            {
                success: function (results)
                {

                    $scope.myPostListParse = results;
                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++)
                    {
                        var object = results[i];
                        var imageObject = object.get('image');
                        //alert('URL'  + imageObject + i);
                        if (!angular.isUndefined(imageObject))
                        {
                            $scope.myPostList.push({
                                postID: object.id,
                                name: object.get('name'),
                                description: object.get('description'),
                                image: imageObject.url(),
                                comments: object.get('comments'),
                                createdBy: object.attributes.createdBy
                            });
                        }
                        else
                        {
                            alert("Hit continue");
                            continue;
                        }

                    }
                    console.log($scope.myPostList.length);
                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            }
        );
    };


    $scope.loadLikedPosts = function()
    {
        setTimeout(function()
        {
            var relation = user.relation('likedPosts');
            var queryLikedPosts = relation.query();
            $scope.likedPostList = [];
            $scope.likedPostListParse = [];
            //alert("ENTERED");

            queryLikedPosts.find(
                {
                    success: function (results)
                    {
                        $scope.likedPostListParse = results;
                        //alert('Successfully retrieved ' + results.length + ' posts.');
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++)
                        {
                            var object = results[i];
                            var imageObject = object.get('image');
                            //alert('URL'  + imageObject + i);
                            if (!angular.isUndefined(imageObject))
                            {
                                $scope.likedPostList.push({
                                    postID: object.id,
                                    name: object.get('name'),
                                    description: object.get('description'),
                                    image: imageObject.url(),
                                    comments: object.get('comments'),
                                    createdBy: object.attributes.createdBy
                                });
                            }
                            else
                            {
                                alert("Hit continue");
                                continue;
                            }

                        }
                        console.log($scope.likedPostList.length);
                    },
                    error: function (error)
                    {
                        alert('Error: ' + error.code + ' ' + error.message);
                    }
                });
        }, 1000);

    };

    $scope.getMyBoards = function()
    {

        var relation = user.relation('myBoards');
        var queryMyBoards = relation.query();
        $scope.boardList = [];
        queryMyBoards.find(
            {
                success: function (results)
                {

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
                            posts:object
                        });
                    }
                    console.log($scope.boardList.length);
                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });
    };




    $scope.loadFollowing = function()
    {

        var relation = user.relation('followUser');
        var queryFollowing = relation.query();
        $scope.followingList = [];
        queryFollowing.find(
            {
                success: function (results)
                {
                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    $scope.followingListFromParse = results;

                    for (var i = 0; i < results.length; i++)
                    {
                        var object = results[i];
                        $scope.followingList.push({
                            userID: object.id,
                            name: object.get('name')
                        });
                    }
                    //alert($scope.likedPostList.length);
                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });
    };

    $scope.loadFollowers = function()
    {
        var Follower = Parse.Object.extend('Followers');
        var queryFollowers = new Parse.Query(Follower);
        queryFollowers.equalTo('username', user.get('username'));
        queryFollowers.find({
            success: function (results)
            {
                //alert('Successfully retrieved ' + results.length + ' posts.');
                // Do something with the returned Parse.Object values
                var array = results[0].get('followers');

                $scope.followersListFromParse = array;

                for (var i = 0; i < array.length; i++)
                {
                    //var object = results[i];
                    $scope.followersList.push({
                        username: array[i]
                    });
                }
                console.log($scope.followersList.length);
            },
            error: function (error)
            {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });
    };
    $scope.viewSelectedLikedPost = function(index)
    {

        $scope.showMap = false;
        $scope.viewPost = $scope.likedPostList[index];
        $scope.viewPostParse = $scope.likedPostListParse[index];

    };
    $scope.viewSelectedMyPost = function(index)
    {

        $scope.showMap = false;
        $scope.viewPost = $scope.myPostList[index];
        $scope.viewPostParse = $scope.myPostListParse[index];

    };
    $scope.viewPostsInBoard = function(index)
    {
        console.log('when do i get called?  ')
        $scope.selectedUserBoard = $scope.boardList[index];

        $scope.showBoards = false;
        $scope.showPins = true;
        var relation = $scope.selectedUserBoard.posts.relation('posts');

        var queryPostsInSelectedBoard = relation.query();

        $scope.postsInBoard = [];
        queryPostsInSelectedBoard.find(
            {
                success: function (results)
                {
                    //alert('test for race condition  ' + results.length);

                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    $scope.postsInBoardParse = results;
                    for (var i = 0; i < results.length; i++)
                    {
                        var object = results[i];
                        var imageObject = object.get('image');
                        //alert('URL'  + imageObject + i);
                        if (!angular.isUndefined(imageObject))
                        {
                            $scope.postsInBoard.push({
                                postID: object.id,
                                name: object.get('name'),
                                description: object.get('description'),
                                image: imageObject.url(),
                                createdBy: object.attributes.createdBy
                            });
                        }
                        else
                        {
                            alert("Hit continue");
                            continue;
                        }

                    }
                    console.log($scope.postsInBoard.length);
                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });


    };
    $scope.viewSelectedPostFromBoard = function(index)
    {
        $scope.showMap = false;

        var post = $scope.postsInBoardParse[index];

        console.log(post);
        //console.log(post);
        var imageObject = post.get('image');
        $scope.viewPost = {
            postID: post.id,
            name: post.get('name'),
            description: post.get('description'),
            image: imageObject.url(),
            createdBy: post.attributes.createdBy,
            comments: post.get('comments')
        }
        //console.log($scope.viewPost);
        //$scope.viewPostParse = $scope.postRecommendationsParse[index];

    };
    $scope.viewSelectedFollowingUserBoards = function(index)
    {
        var selectedUserBoards = $scope.followingListFromParse[index];

        $scope.followers = false;
        $scope.following = true;

        console.log('FFFOOOOLLLOOWOWWWOWINGGNGNGNGNG');
        console.log(selectedUserBoards);
        $scope.showBoards = true;
        $scope.showPins = false;

        console.log('look at this here');
        console.log(selectedUserBoards);
        console.log('-------------------------');
        var relation = selectedUserBoards.relation('myBoards');

        //console.log(relation);

        var queryLikedPosts = relation.query();

        //console.log(blah);
        queryLikedPosts.find(
            {
                success: function (results)
                {
                    if(results.length !== 0)
                    {
                        for (var i = 0; i < results.length; i++)
                        {
                            var object = results[i];
                            $scope.followingListBoards.push({
                                postID: object.id,
                                name: object.get('name'),
                                description: object.get('description'),
                                createdBy: object.get('createdBy'),
                                posts:object
                            });
                            //var imageObject = object.get('image');
                            //alert('URL'  + imageObject + i);
                            // console.log(object);

                        }
                    }
                    else
                    {
                        alert('User has no boards.')
                    }
                    //console.log($scope.likedPostList.length);
                },
                error: function (error)
                {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });


    };



    $scope.getMyBoards();
    $scope.getMyPosts();
    $scope.loadLikedPosts();
    $scope.loadFollowing();

    $scope.loadFollowers();
});