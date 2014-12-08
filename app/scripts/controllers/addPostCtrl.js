var app = angular.module('peterestApp');
//../views/directives/addNewPostModalDirective.html
app.controller('AddPostCtrl', function ($location, $scope, $modal)
{
    $scope.availableActionsOfAnimals = [];
    $scope.availableCategoriesOfAnimals = [];

    $scope.showAddPost = false;
    $scope.userBoards = [];

    $scope.selectedBoardAddPost = null;


    $scope.openMod = function()
    {
        console.log("We're in the right place");
        console.log("$modal = ", $modal);
        $scope.modalInstance = $modal.open({templateUrl: "../views/directives/addNewPostModalDirective.html",
            controller: "modal_helper",
            resolve:{
                availableActionsOfAnimals: function () {
                    return $scope.availableActionsOfAnimals;
                },
                availableCategoriesOfAnimals: function () {
                    return $scope.availableCategoriesOfAnimals;
                },
                userBoards: function () {
                    return $scope.userBoards;
                }
            }});
        console.log("modalInstance = ", $scope.modalInstance);
    };

    //$scope.selectedBoardAddPost = $scope.userBoards[index];
    //console.log($scope.selectedBoardAddPost);

    $scope.setTab = function(setTabThing)
    {
        //console.log('setTab' + setTab);
        $scope.tab = setTabThing;

    };
    $scope.checkTab = function(checkTabThing)
    {
        //console.log('check tab' + checkTab);
        return $scope.tab === checkTabThing;
    };

    $scope.getUserCreatedBoards = function()
    {
        $scope.user = Parse.User.current();

        var relationBoards = $scope.user.relation('myBoards');
        $scope.userBoards = [];

        var queryBoards = relationBoards.query();
        queryBoards.find(
            {
                success: function(results)
                {
                    if(results.length > 0)
                    {
                        $scope.showAddPost = true;
                    }
                    else
                    {
                        $scope.showAddPost = false;
                    }
                    $scope.userBoards = results;
                },
                error: function(error) {
                    // alert('Error: ' + error.code + ' ' + error.message);
                }

            });
    };

    $scope.getSelectedAction = function()
    {
        var Categories = Parse.Object.extend('Actions');
        var query = new Parse.Query(Categories);

        query.find({
            success: function(results)
            {
                console.log('getting actions');
                for(var i = 0; i < results.length; i++)
                {
                    $scope.availableActionsOfAnimals.push(results[i]);
                }

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

                console.log('getting cats');
                for(var i = 0; i < results.length; i++)
                {
                    $scope.availableCategoriesOfAnimals.push(results[i]);
                }


            },
            error: function(error)
            {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });
    };

    $scope.getSelectedCategoriesOfAnimals();
    $scope.getSelectedAction();
    $scope.getUserCreatedBoards();
});

app.controller('modal_helper', function ($location, $scope, $modalInstance, availableActionsOfAnimals, availableCategoriesOfAnimals, userBoards)
{
    $scope.selectedCategoriesOfNewPost = [];
    $scope.selectedActionsOfNewPost = [];

    $scope.availableActionsOfAnimals = availableActionsOfAnimals;
    $scope.availableCategoriesOfAnimals = availableCategoriesOfAnimals;
    $scope.selectedBoard = null;
    $scope.userBoards = userBoards;

    $scope.animalCoatPatterns = ['Stripe', 'Spotted', 'Solid Color'];
    $scope.animalHairLength = ['Long', 'Medium', 'Short'];
    $scope.animalSize = ['Large 75+lbs', 'Medium 50 - 75lbs', 'Small 15 - 50lbs', 'Extra Small 0 - 15lbs'];



    $scope.tab = -1;

    $scope.userSelectsBoardToPinPost = function( index )
    {

        $scope.selectedBoardAddPost = $scope.userBoards[index];
        $scope.selectedBoard = $scope.userBoards[index];
        console.log($scope.selectedBoard);
    };

    $scope.addSelectedAction = function( index )
    {
        //console.log(index);

        $scope.actionToAdd = $scope.availableActionsOfAnimals[index].attributes.name;

        if($scope.selectedActionsOfNewPost.indexOf( $scope.actionToAdd ) == -1)
        {
            //console.log('ADDING' + $scope.actionToAdd);
            $scope.selectedActionsOfNewPost.push( $scope.actionToAdd );
        }
        else
        {
            //console.log('Removing' + $scope.actionToAdd);
            $scope.selectedActionsOfNewPost.splice( $scope.actionToAdd, 1 );
        }

        //console.log($scope.selectedActionsOfNewPost);

    };

    $scope.addSelectedCategory = function( index )
    {
        //console.log(index);

        $scope.categoryToAdd = $scope.availableCategoriesOfAnimals[index].attributes.name;

        if($scope.selectedCategoriesOfNewPost.indexOf( $scope.categoryToAdd ) == -1)
        {
            //console.log('ADDING');
            $scope.selectedCategoriesOfNewPost.push( $scope.categoryToAdd );
        }
        else
        {
            //console.log('Removing');
            $scope.selectedCategoriesOfNewPost.splice( $scope.categoryToAdd, 1 );
        }

        //console.log($scope.selectedCategoriesOfNewPost);

    };

    $scope.createNewPost = function()
    {

        var currentUser = Parse.User.current();
        if (currentUser)
        {

            $scope.tags = [];
            //var likeCats = $scope.selectedCategoriesUserLikes;
            //var likeActions = $scope.selectedActionsUserLikes;

            var i = 0;
            for(i = 0; i < $scope.selectedActionsOfNewPost.length; i++)
            {
                $scope.tags.push( $scope.selectedActionsOfNewPost[i] );
            }
            for(i = 0; i < $scope.selectedCategoriesOfNewPost.length; i++)
            {
                $scope.tags.push( $scope.selectedCategoriesOfNewPost[i] );
            }

            $scope.nameOfPost = angular.element(document.getElementById('addPostContents_nameOfPost')).val();
            $scope.descriptionOfPost = angular.element(document.getElementById('addPostContents_descriptionOfPost')).val();


            //get the image file
            var fileUploadControl = $("#animalPhoto")[0];

            console.log(fileUploadControl.files);
            //fileUploadControl.files.length > 0 &&
            if( $scope.selectedActionsOfNewPost.length != 0 && $scope.selectedCategoriesOfNewPost.length != 0 && $scope.nameOfPost.length != 0 && $scope.descriptionOfPost.length != 0)
            {
                //alert('about to upload');
                console.log('ahhhhhhh');
                var file = fileUploadControl.files[0];
                var name = "photo.jpg";

                var parseFile = new Parse.File(name, file);

                //save the image file to Parse's cloud
                parseFile.save().then(function()
                    {
                        // The file has been saved to Parse.
                        var Post = Parse.Object.extend('Posts');
                        var newPost = new Post();



                        //var boardRelation = $scope.selectedBoardAddPost.relation('posts');

                        console.log("selected board = ", $scope.selectedBoard)
                        var boardRelation = $scope.selectedBoard.relation('posts');

                        var relationToUserPosts = currentUser.relation('myPosts');

                        console.log(boardRelation);
                        $scope.initialzeCommentsArray = [];

                        newPost.set('name', $scope.nameOfPost);
                        newPost.set('createdBy', currentUser.attributes.username);
                        newPost.set('description', $scope.descriptionOfPost);
                        newPost.set('image', parseFile);
                        newPost.set('tags', $scope.tags);
                        newPost.set('numberOfLikes', 0);
                        newPost.set('comments', $scope.initialzeCommentsArray);

                        newPost.save(null,
                            {
                                success: function (newPostPosted)
                                {
                                    // Execute any logic that should take place after the object is saved.
                                    alert('New object created with objectId: ' + newPostPosted.id);

                                    boardRelation.add(newPostPosted);
                                    relationToUserPosts.add(newPostPosted);
                                    $scope.selectedBoardAddPost.save();
                                    currentUser.save();
                                    fileUploadControl.files[0] = null;
                                    $modalInstance.dismiss('cancel');
                                },
                                error: function (newPost, error)
                                {
                                    // Execute any logic that should take place if the save fails.
                                    // error is a Parse.Error with an error code and message.
                                    alert('Failed to create new object, with error code: ' + error.message);
                                }
                            });
                    },
                    function(error)
                    {
                        // The file either could not be read, or could not be saved to Parse.
                        console.log("Image file could not be saved to Parse");
                    });

            }
            else
            {
                alert('Error in uploading post');
            }
        }
        else
        {
            console.log('Need to login a user');
            // show the signup or login page
        }
    };

    $scope.close_modal = function()
    {
        $modalInstance.close('cancel')
    };


    $scope.tabLostPostInfo = 0;
    var currUser;

    $scope.categorysOfAnimals = ['Dog','Cat','Lizard','Bird'];


    $scope.lostAnimalSelectedCategory = '';
    $scope.selectedLostAnimalPattern = '';
    $scope.selectedLostAnimalHairLength = '';
    $scope.selectedLostAnimalSize = '';
    $scope.selectedColors = [];

    $scope.isError = false;
    $scope.errorMessage = '';

    //////////////////For tabbing
    $scope.setTab = function(setTab)
    {
        $scope.tabLostPostInfo = setTab;
    };
    $scope.checkTab = function(checkTab)
    {
        return $scope.tabLostPostInfo === checkTab;
    };
    ///////////////

    $scope.selectedColor = function(color)
    {
        console.log(color);
        $scope.selectedColors.push( ['Black', 'Brown'] );
    };
    $scope.selectedCategory = function(chosenCategory)
    {
        $scope.lostAnimalSelectedCategory = chosenCategory;
    };
    $scope.selectedPattern = function(chosenPattern)
    {
        $scope.selectedLostAnimalPattern = chosenPattern;
    };
    $scope.selectedHairLength = function(chosenHairLength)
    {
        $scope.selectedLostAnimalHairLength = chosenHairLength;
    };
    $scope.selectedSize = function(chosenSize)
    {
        $scope.selectedLostAnimalSize = chosenSize;
    };
    $scope.useCurrentUserAsContactInfo = function()
    {
        currUser = Parse.User.current();
        console.log(currUser);
    };
    $scope.postLostAnimal = function()
    {

        $scope.errorMessage = '';
        var animalName = angular.element(document.getElementById('addLostAnimalContents_nameOfAnimal')).val();
        var animalMedicalInfoNotes = angular.element(document.getElementById('addLostAnimalContents_medicalNotes')).val();
        var lastKnownAddress = angular.element(document.getElementById('addLostAnimalContents_lastKnownAddress')).val();
        //addLostAnimalContents_lastKnownAddress
        $scope.selectedColors = ['Black', 'Brown'];

        var animalImage = angular.element(document.getElementById('addLostAnimalContents_fileUpload'));
        var lostPostZipCode = angular.element(document.getElementById('addLostAnimalContents_zipCode')).val();

        if(angular.isUndefined(animalImage[0]))
        {
            console.log('YAY not going to take an empty image');
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed to upload an image';
        }
        if(lostPostZipCode === 'undifined')
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Lost Zip Code';
        }
        if($scope.lostAnimalSelectedCategory === '')
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Category';
        }
        if($scope.selectedLostAnimalPattern === '')
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Pattern';
        }
        if(animalName === ' ' || animalName.length === 0)
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Name';
        }
        if(animalMedicalInfoNotes === ' ' || animalMedicalInfoNotes.length === 0)
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Notes';
        }
        if($scope.selectedColors.length === 0)
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Colors';
        }

        if($scope.selectedLostAnimalSize === '')
        {
            $scope.isError = true;
            $scope.errorMessage = $scope.errorMessage + '\nNeed Animal Size';
        }

        if(!$scope.isError)
        {
            //addLostAnimalContents_fileUpload
            var fileUploadControl = $("#addLostAnimalContents_fileUpload")[0];

            var file = fileUploadControl.files[0];
            var name = "photo.jpg";

            var parseFile = new Parse.File(name, file);

            //save the image file to Parse's cloud
            parseFile.save().then(function()
            {
                var LostPosts = Parse.Object.extend('LostAnimalPost');
                var newLostPost = new LostPosts();
                var lostPostUserRelation = newLostPost.relation('contactUser');
                console.log('where do we get to?');
                //console.log('Animal name:' + animalName);
                //console.log('Animal Medical notes and notes:' + animalMedicalInfoNotes);

                newLostPost.set('name', animalName);
                newLostPost.set('medicalInfo', animalMedicalInfoNotes);
                newLostPost.set('category', $scope.lostAnimalSelectedCategory);
                newLostPost.set('colors', $scope.selectedColors);
                newLostPost.set('pattern', $scope.selectedLostAnimalPattern);
                newLostPost.set('image', parseFile);
                newLostPost.set('isFound', false);
                newLostPost.set('reward', 10);
                newLostPost.set('size', $scope.selectedLostAnimalSize);
                newLostPost.set('hairLength', $scope.selectedLostAnimalHairLength);
                newLostPost.set('lastKnownAddress', lastKnownAddress);

                lostPostUserRelation.add(currUser);
                newLostPost.save(null, {
                    success: function (newLostPost)
                    {
                        // Execute any logic that should take place after the object is saved.
                        //lostPostUserRelation.save();
                        alert('New object created objectId: ' + newLostPost.id);
                        $modalInstance.dismiss('cancel');
                    },
                    error: function (newLostPost, error)
                    {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            });
        }
        else
        {
            alert($scope.errorMessage);
        }

    };
});