angular.module('enterpriseSearch')
  .controller('searchController', ['$scope', '$rootScope', '$sce', '$routeParams', '$location', 'searchService', function($scope, $rootScope, $sce, $routeParams, $location, searchService) {
    $scope.results = {};
    $scope.show = false;
    $scope.page = 0;
    $scope.submit = function (search, page, resultsPerPage) {
      search = search.trim();
      if (isNaN(page) || page < 0) page = 0;
      if (isNaN(resultsPerPage) || resultsPerPage <= 0) resultsPerPage = 14;
      var url = '/search?q='+searchService.sanitizeQuery(search)+'&page='+page+'&rpp='+resultsPerPage;
      $location.url(url);
    };

    $scope.filterSource = function(str) {
      $scope.submit($rootScope.query
          .replaceAll(new RegExp('(?:^|\\s)index:([^\\s]+)', 'i'), '')
          .trim()
          + (str !== 'all' ? (' index:'+str) : ('')), $scope.page, $scope.resultsPerPage);
    };
    
    $scope.limitFullText = function(str, numChars) {
      if (str.length < numChars) {
        return str;
      } else {
        var index = str.slice(0, numChars);
        var indexNum = index.regexLastIndexOf(new RegExp('\\s'));
        return (indexNum > 0 ? str.slice(0, indexNum).trim() : index.trim()) + '...';
      }
    };
    
    /* $scope.boldQuery = function (body, query) {
      query.split(new RegExp('\\s')).forEach(function (el) {
        body = body.replaceAll(el, '<b>'+el+'</b>');
      });
      return $sce.trustAsHtml(body);
    } */
    
    $rootScope.query = $routeParams.q || '';
    $scope.page = parseInt($routeParams.page) || 0;
    if ($scope.page < 0) $scope.page = 0;
    $scope.resultsPerPage = parseInt($routeParams.rpp) || 14;
    
    $scope.minPage = 0;
    $scope.maxPage = 0;
    $scope.displayBackwards = false;
    $scope.displayForwards = false;
    $scope.pageRange = [];
    
    var indexList = ($rootScope.query.match(new RegExp('(?:^|\\W)index:([^\\s]+)', 'g')) || []).map(function (el) { return el.replace(new RegExp('.*index:'), ''); });
    $scope.indexFilter = (indexList.length > 0) ? indexList[0] : 'all';
    
    if ($rootScope.query && !($rootScope.query === '')) {
      if (!($rootScope.query === $routeParams.q)) {
        $scope.submit($rootScope.query, $routeParams.page, $routeParams.rpp);
      } else {
        var SLIDE_SPEED = 300;
        var FADE_SPEED = 200;
        $('.loading-bar').css('width', '0%');
        $('.loading-bar').css('background-color', '#0000FF');
        $('.loading-bar').animate({width:'80%'}, SLIDE_SPEED);
        if ($scope.resultsPerPage == 0) $scope.resultsPerPage = 14;
        searchService.advancedSearch($rootScope.query, $scope.page, $scope.resultsPerPage, function(response) {
          $scope.results = response;

          $scope.minPage = 0;
          $scope.maxPage = Math.ceil($scope.results.hits.total / $scope.resultsPerPage) | 0;
          $scope.minDisplayPage = Math.min($scope.maxPage-($scope.page+1), 8) == 8 ?
                  (($scope.page > $scope.minPage ? ($scope.page-1) : ($scope.page))+1)
                : ($scope.maxPage - 8 < 0 ? 1 : $scope.maxPage - 8);
          $scope.maxDisplayPage = Math.min($scope.maxPage+1, $scope.minDisplayPage+8);
          $scope.displayBackwards = $scope.page > $scope.minPage;
          $scope.displayForwards = $scope.page+1 < $scope.maxPage;
          $scope.pageRange = Array.range($scope.minDisplayPage, $scope.maxDisplayPage-$scope.minDisplayPage);
          
          $scope.show = true;          
          $('.loading-bar').animate({width:'100%'}, SLIDE_SPEED, function () {
            $('.loading-bar').animate({backgroundColor: 'white'}, FADE_SPEED, function () {
              $('.loading-bar').css('width', '0%');
              $('.loading-bar').css('background-color', '#0000FF');
            });            
          });
        }, function (error) {
          $scope.show = false;
        });
      }
    }
  }]);