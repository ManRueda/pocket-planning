(function(angular, app, socket){

  app.controller('planningController', ['$scope', 'importedData', function($scope, importedData){
    var that = this;
    that.model = {};
    that.source = importedData.stories || [];

    socket.emit('addUser', {session: importedData.uuid});

    socket.on('storyCreated', function(story){
      that.source.push(story);
      $scope.$digest();
    });

    socket.on('storyDeleted', function(uuid){
      deleteStory(uuid);
      $scope.$digest();
    });

    that.addStory = function(){
      that.source.push({
        session: importedData.uuid,
        uuid: generateUUID(),
        text: that.model.name
      });
      that.model.name = '';
      socket.emit('addStory', that.source[that.source.length - 1]);
    };

    that.delStory = function(uuid){
      deleteStory(uuid);
      socket.emit('delStory', {sesUuid: importedData.uuid, stoUuid: uuid});
    };

    function deleteStory(uuid){
      var story = that.source.filter(function(story){
        return story.uuid === uuid;
      })[0];
      that.source.splice(that.source.indexOf(story), 1);
    }

  }]);

})(angular, window.app, socket);
