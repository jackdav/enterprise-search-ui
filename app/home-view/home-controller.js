/**
 * Created by davisjac on 8/1/2016.
 */
angular.module('enterpriseSearch')
  .controller('homeController', ['$scope', '$rootScope', '$location', 'searchService', function($scope, $rootScope, $location, searchService) {
    $scope.search = '';
    $rootScope.query = '';
    $scope.submit = function() {
      $rootScope.query = $scope.search;
      $location.url('/search?q='+searchService.sanitizeQuery($scope.search));
    }
  }]);