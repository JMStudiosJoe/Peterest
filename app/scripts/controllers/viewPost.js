var app = angular.module('peterestApp');

app.controller('ViewPostCtrl', function ($location, $scope, $window)
{
    $scope.test = 'logic';


    $scope.submitNewComment = function()
    {
        var newComment = angular.element(document.getElementById('viewPostModal_newComment'));

        var currUsername = Parse.User.current().get('username');
        var fullComment = currUsername+ ' : ' + newComment.val();
        console.log($scope.viewPost + ':::::' + fullComment);

        $scope.viewPost['comments'].push(fullComment);

        var viewPostID = $scope.viewPost.postID;

        var Post = Parse.Object.extend("Posts");
        var query = new Parse.Query(Post);
        query.get(viewPostID, {
            success: function(post)
            {
                post.add('comments', fullComment);
                post.save();
                alert('Comment saved');
                $window.location.reload();
                newComment.empty();

                // The object was retrieved successfully.
            },
            error: function(object, error)
            {
                console.log(error);
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
            }
        });
    };

});