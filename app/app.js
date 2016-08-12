var app = angular.module('enterpriseSearch', ['ngRoute', 'ngResource']);

angular.module('enterpriseSearch')
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home-view/home.html',
                controller: 'homeController',
                css: 'home-view/home.css'
            }).when('/search', {
                templateUrl: 'search-view/search.html',
                controller: 'searchController',
                css: 'search-view/search.css'
            }).otherwise({
                redirectTo: '/'
            });
    })
    .directive('head', ['$rootScope','$compile',
        function($rootScope, $compile){
            // allows an injection of css into a route so that each route can have a different style format
            return {
                restrict: 'E',
                link: function(scope, elem){
                    var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                    elem.append($compile(html)(scope));
                    scope.routeStyles = {};
                    $rootScope.$on('$routeChangeStart', function (e, next, current) {
                        if(current && current.$$route && current.$$route.css){
                            if(!angular.isArray(current.$$route.css)){
                                current.$$route.css = [current.$$route.css];
                            }
                            angular.forEach(current.$$route.css, function(sheet){
                                delete scope.routeStyles[sheet];
                            });
                        }
                        if(next && next.$$route && next.$$route.css){
                            if(!angular.isArray(next.$$route.css)){
                                next.$$route.css = [next.$$route.css];
                            }
                            angular.forEach(next.$$route.css, function(sheet){
                                scope.routeStyles[sheet] = sheet;
                            });
                        }
                    });
                }
            };
        }
    ]);

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };
}

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if(startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
};

if (!Array.range) {
  Array.range = function range(start, count) {
    return Array.apply(0, Array(count))
      .map(function (element, index) { 
        return index + start;  
    });
  }
}

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : false;
}

if (getChromeVersion() && getChromeVersion() < 35) {
    alert("You have an outdated version of Chrome");
    window.location = "https://www.google.com/chrome/browser/desktop/";
}