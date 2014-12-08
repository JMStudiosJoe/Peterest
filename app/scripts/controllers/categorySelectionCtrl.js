'use strict';

/**
 * @ngdoc function
 * @name peterestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the peterestApp
 */
var app = angular.module('peterestApp');

app.controller('CatSelCtrl', function ($scope, $location, $interval)
{
    $scope.test = 'test cat sel controller';

    $scope.selectingCategoryItems = true;
    $scope.addCategory = true;


    $scope.dataToDisplay = ['Dogs', 'Cat', 'Tutle', 'Fish', 'Lizards', 'Birds'];
    $scope.availableCategoriesOfAnimals = ['Dogs', 'Cat', 'Tutle', 'Fish', 'Lizards', 'Birds'];
    $scope.availableActionsOfAnimals = ['Happy', 'Sad', 'Trouble', 'Funny', 'Loving'];
    $scope.tags = [];


    $scope.selectedCategoriesUserLikes = [];
    $scope.selectedActionsUserLikes = [];

    var c;
    $scope.message="This DIV is refreshed "+c+" time.";
    $interval(function()
    {
        $scope.message="This DIV is refreshed "+c+" time.";
        c++;
    },1000);
    $scope.getUserTagsForAddingTags = function()
    {
        var currUser = Parse.User.current();

        var cats = currUser.get('likedCategories');
        var actions = currUser.get('likedActions');
        console.log(cats);
        console.log(actions);
        if(!angular.isUndefined(cats) && !angular.isUndefined(actions))
        {
            var i = 0;
            for(i = 0; i < cats.length; i++)
            {
                $scope.tags.push(cats[i]);
            }
            for(i = 0; i < actions.length; i++)
            {
                $scope.tags.push(actions[i]);
            }
        }
    };

    $scope.saveActionsAndCategoriesToDatabase = function()
    {
        var currentUser = Parse.User.current();
        if (currentUser && $scope.selectedCategoriesUserLikes.length != 0 && $scope.selectedActionsUserLikes.length != 0)
        {
            var likeCats = $scope.selectedCategoriesUserLikes;
            var likeActions = $scope.selectedActionsUserLikes;
            //console.log('user cat likes   ' + $scope.selectedCategoriesUserLikes.length + '::::::  actions liked   ' + $scope.selectedActionsUserLikes.length);

            currentUser.set("likedCategories", likeCats);
            currentUser.set("likedActions", likeActions);

            currentUser.save(null, {
                success: function(post)
                {
                    $location.path('/dashboard');
                    window.location.href = '../views/dashboard.html';
                }
            });

        }
        else
        {
            console.log('Need to login a user');
            // show the signup or login page
        }
    };
    $scope.addCategoryToDatabase = function()
    {
        var addNewCategory = angular.element(document.getElementById('categorySelection_addCategory')).val();
        if(addNewCategory !== ' ' && addNewCategory.length !== 0)
        {
            var Category = Parse.Object.extend('Categories');
            var newCategory = new Category();

            newCategory.set('name', addNewCategory);
            newCategory.save(null, {
                success: function(category) {
                    // Execute any logic that should take place after the object is saved.
                    $scope.availableCategoriesOfAnimals.push(addNewCategory);
                    alert('New object created with objectId: ' + category.id);
                },
                error: function(gameScore, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else
        {
            alert('Invalid Category! Please enter a valid category.')
        }
    };
    $scope.addActionToDatabase = function()
    {

        var addNewAction = angular.element(document.getElementById('categorySelection_addAction')).val();
        if(addNewAction !== ' ' && addNewAction.length !== 0)
        {
            var Action = Parse.Object.extend('Actions');
            var newAction = new Action();

            newAction.set('name', addNewAction);
            newAction.save(null, {
                success: function(action) {
                    // Execute any logic that should take place after the object is saved.
                    $scope.availableActionsOfAnimals.push(addNewAction);

                    alert('New object created with objectId: ' + action.id);
                },
                error: function(gameScore, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else
        {
            alert('Invalid Action! Please enter a valid category.')
        }
    };
    $scope.chooseCategoriesOfAnimals = function()
    {
        $scope.dataToDisplay.removeAll;
        //console.log('now todisplay actions');
        $scope.selectingCategoryItems = true;
        $scope.addCategory = true;
        $scope.dataToDisplay = $scope.availableCategoriesOfAnimals;
    };
    $scope.chooseActionsOfAnimals = function()
    {
        $scope.dataToDisplay.removeAll;
        //console.log('now todisplay actions');
        $scope.selectingCategoryItems = false;
        $scope.addCategory = false;
        $scope.dataToDisplay = $scope.availableActionsOfAnimals;
    };
    $scope.getSelectedAction = function()
    {
        var Categories = Parse.Object.extend('Actions');
        var query = new Parse.Query(Categories);

        query.find({
            success: function(results)
            {
                $scope.availableActionsOfAnimals = results;

            },
            error: function(error)
            {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });
    };

    $scope.getSelectedCategoriesOfAnimals = function()
    {

        var Categories = Parse.Object.extend('Categories');
        var query = new Parse.Query(Categories);

        query.find({
            success: function(results)
            {

                $scope.availableCategoriesOfAnimals = results;



            },
            error: function(error)
            {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });
    };
    $scope.contains = function(value, passedArray)
    {
        for(var i = 0; i < passedArray.length; i++)
        {
            if(value === passedArray[i])
            {
                return true;
            }

        }
        return false;
    };
    $scope.selectedItemFromDispalyList = function (selectedItemIndex)
    {
        var dataID = '#listOfAnimals_data_' + selectedItemIndex;
        //var selectedItem = angular.element(document.getElementById(dataID));


        if($scope.selectingCategoryItems)
        {
            var selectedCategory = $scope.availableCategoriesOfAnimals[selectedItemIndex];
            console.log(selectedCategory);
            selectedCategory = selectedCategory.attributes.name;
            var index = $scope.selectedCategoriesUserLikes.indexOf(selectedCategory);
            var tagIndex = $scope.tags.indexOf(selectedCategory);
            if(index === -1)
            {

                console.log('adding');
                $scope.tags.push(selectedCategory);
                $scope.selectedCategoriesUserLikes.push(selectedCategory);

            }
            else
            {

                console.log('removing');
                $scope.selectedCategoriesUserLikes.splice(index, 1);
                $scope.tags.splice(tagIndex, 1);

            }
        }
        else
        {
            var selectedAction = $scope.availableActionsOfAnimals[selectedItemIndex];
            selectedAction = selectedAction.attributes.name;
            var index = $scope.selectedActionsUserLikes.indexOf(selectedAction);
            var tagIndex = $scope.tags.indexOf(selectedAction);
            if(index === -1 || tagIndex === -1)
            {

                console.log('adding');
                $scope.tags.push(selectedAction);
                $scope.selectedActionsUserLikes.push(selectedAction);
            }
            else
            {

                console.log('removing');
                $scope.tags.splice(tagIndex, 1);
                $scope.selectedActionsUserLikes.splice(index, 1);

            }


        }

    };


    $scope.getSelectedCategoriesOfAnimals();
    $scope.getSelectedAction();

    $scope.getUserTagsForAddingTags();
});
