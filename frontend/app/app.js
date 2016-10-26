'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.factory('linkRefresh', ['$http',function($http){
  var scope = undefined;

  function _setScope($scope) {
    scope = $scope;
  }

  function refresh($scope){
    console.log("aa");
    $http.get('/api/list').then(function (res) {
      scope.links = res.data;
    });
  }

  return {
    _setScope:_setScope,
    refresh:refresh
  };
}]).controller('appCtrl', ['$scope', 'linkRefresh', function($scope, linkRefresh){
  linkRefresh._setScope($scope);
  linkRefresh.refresh($scope);
}])