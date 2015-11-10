(function(angular, app){
  app.directive('loadConfig', [function(){
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        scope.importedData = angular.fromJson(attr.loadConfig);
      }
    };
  }]);

})(angular, window.app);
