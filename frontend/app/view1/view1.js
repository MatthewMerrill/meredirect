'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$routeParams', '$http', 'linkRefresh', function($scope, $routeParams, $http, linkRefresh) {
  $scope.link = $routeParams.link;
  $scope.form = {};

  $scope.submit = function (data) {
    console.log($scope.form);
    $http.put('/api/key/' + $scope.form.key, $scope.form).then(function (res) {
      console.log(res);
    })
    linkRefresh.refresh();
  };

  $scope.delete = function(key) {
    $http['delete']('/api/key/'+key).then(function(){
      $scope.form = {};
    });
    linkRefresh.refresh();
  };

  if ($scope.link) {
    $scope.form.key = $scope.link;
    $http.get('/api/key/' + $routeParams.link).then(function (res) {
      if (res.status == 200)
        $scope.form.value = res.data.value;
      else
        $scope.form.value = $scope.form.value || "http://go.mattmerr.com/";
    });
  }
}]);