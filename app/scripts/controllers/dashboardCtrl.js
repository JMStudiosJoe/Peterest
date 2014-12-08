'use strict';

/**
 * @ngdoc function
 * @name peterestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the peterestApp
 */
var app = angular.module('peterestApp');

app.controller('DashCtrl', function ($scope, $location, $interval)
{
    var user = Parse.User.current();

    $scope.username = user.get('username');

    $scope.searchArray = [];
    $scope.postRecommendations = [];
    $scope.postRecommendationsParse = [];
    $scope.postLostAnimals = [];
    $scope.likedPostList = [];

    $scope.showMap = false;
    $scope.viewPost = null;
    $scope.viewPostParse = null;

    $scope.streetAddressCoordinates = 0.0;
    var c = 0;
    $scope.message="This DIV is refreshed "+c+" time.";
    $interval(function()
    {
        $scope.message="This DIV is refreshed "+c+" time.";
        c++;
    },1000);

    $scope.viewSelectedPost = function(index)
    {
        console.log('making it here???');
        $scope.showMap = false;
        $scope.viewPost = $scope.postRecommendations[index];
        $scope.viewPostParse = $scope.postRecommendationsParse[index];

    };
    $scope.viewSelectedLostPost = function(index)
    {
        $scope.showMap = true;
        $scope.viewPost = $scope.postLostAnimals[index];
        //$scope.viewPostParse = $scope.postRecommendationsParse[index];
        console.log('Selected post to view :::: ' + $scope.viewPost);
        $scope.viewOnMap($scope.viewPost.lastKnown, index);
    };

    $scope.fillRecommendationsList = function()
    {

        var relationRecs = user.relation('recommendations');
        $scope.postRecommendations = [];
        $scope.postRecommendationsParse = [];
        var queryRecPosts = relationRecs.query();
        queryRecPosts.find(
            {
                success: function(results)
                {
                    $scope.postRecommendationsParse = results;
                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++)
                    {
                        var object = results[i];
                        var imageObject = object.get('image');
                        //alert('URL'  + imageObject.url());
                        if(!angular.isUndefined(imageObject))
                        {
                            $scope.postRecommendations.push({
                                postID: object.id,
                                name: object.get('name'),
                                description: object.get('description'),
                                image: imageObject.url(),
                                createdBy: object.attributes.createdBy,
                                comments: object.get('comments')
                            });
                        }
                        else
                        {
                            continue;
                        }
                    }
                    //alert($scope.post.length);
                },
                error: function(error) {
                    // alert('Error: ' + error.code + ' ' + error.message);
                }

            });

    };

    $scope.fillLostAnimalPosts = function()
    {

        $scope.postLostAnimals = [];
        var LostPosts = Parse.Object.extend('LostAnimalPost');
        var queryLostPosts = new Parse.Query(LostPosts);
        queryLostPosts.find(
            {
                success: function(results)
                {
                    //alert('Successfully retrieved ' + results.length + ' posts.');
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++)
                    {
                        var object = results[i];
                        var imageObject = object.get('image');
                        //alert('URL'  + imageObject.url());
                        if(!angular.isUndefined(imageObject))
                        {
                            $scope.postLostAnimals.push({
                                postID: object.id,
                                name: object.get('name'),
                                description: object.get('description'),
                                image: imageObject.url(),
                                createdBy: object.attributes.createdBy,
                                isLost:object.get('isFound'),
                                lastKnown: object.get('lastKnownAddress')
                            });
                        }
                        else
                        {
                            continue;
                        }
                    }
                    //alert($scope.post.length);
                },
                error: function(error) {
                    // alert('Error: ' + error.code + ' ' + error.message);
                }

            });

    };



    $scope.search = function()
    {
        $scope.searchTerm = angular.element(document.getElementById('srch-term')).val();
        document.querySelector("#recommendationsDiv").style.display = 'none';
        document.querySelector("#lostAnimalDiv").style.display = 'none';

        var Board = Parse.Object.extend('Boards');
        var query = new Parse.Query(Board);
        $scope.searchArray = [];
        query.find({
            success: function(results)
            {
                // Do something with the returned Parse.Object values
                for(var i = 0; i < results.length; i++)
                {
                    var object = results[i];
                    if(object.get('name').toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1)
                    {
                        //matchArray.push(object);
                        $scope.searchArray.push({
                            postID: object.id,
                            name: object.get('name'),
                            description: object.get('description'),
                            createdBy: object.get('createdBy'),
                            posts:object
                        });
                    }
                }
                console.log($scope.searchArray.length + ' Boards contain ' + $scope.searchTerm);
            },
            error: function(error) {
                alert('Error: ' + error.code + '' + error.message);
            }
        });

    };

    $scope.followUser = function(usernameToFollow)
    {
        console.log('ready to follow user:   ' + usernameToFollow);

        var user = Parse.User.current();

        if (user)
        {
            var FollowUser = Parse.Object.extend('User');
            var query = new Parse.Query(FollowUser);
            query.equalTo('username', usernameToFollow);
            query.find({
                success: function(results)
                {

                    var relationToUserPosts = user.relation('followUser');

                    $scope.userToAdd = results[0];

                    relationToUserPosts.add(results[0]);

                    user.save();

                },
                error: function(error)
                {
                    alert('Error: ' + error.code + '' + error.message);
                }
            });
        }
        else
        {
            console.log('Need to login a user');
            // show the signup or login page
        }


    };


    $scope.map =
    {
        center:
        {
            latitude: 36, longitude: 16
        },
        zoom: 8
    };
    $scope.lostPetCoordinates =
    {
        point:
        {
            latitude: 6,
            longitude:6
        }
    };
    $scope.viewOnMap = function(lastKnowLocation, index)
    {
        $scope.viewPost = $scope.postLostAnimals[index];

        var geocoder;

        $scope.showMap = true;

        geocoder = new google.maps.Geocoder();

        var connectMap = angular.element(document.getElementById('lostPetMap'));

        //var tempMap = google.maps.Map('lostPetMap', $scope.map);
        GoogleMaps.maps;//this is a bug

        //google.maps.event.trigger(connectMap, 'resize');

        console.log(connectMap);

        geocoder.geocode({ 'address': lastKnowLocation },
            function (results, status)
            {
                if (status == google.maps.GeocoderStatus.OK)
                {


                    $scope.map.center.latitude = results[0].geometry.location.B;
                    $scope.map.center.longitude = results[0].geometry.location.k;
                    var tempMap = google.maps.Map('lostPetMap', {

                        center: results[0].geometry.location,
                        zoom: 8

                    });

                    //connectMap.setCenter(results[0].geometry.location);
                    tempMap.setCenter(results[0].geometry.location);
                    $scope.lostPetCoordinates.point.latitude = results[0].geometry.location.B;
                    $scope.lostPetCoordinates.point.longitude = results[0].geometry.location.k;

                }
            }
        );

    };

    $scope.logoutUser = function()
    {
        user = null;

    };
    $scope.fillRecommendationsList();

    $scope.fillLostAnimalPosts();
});
