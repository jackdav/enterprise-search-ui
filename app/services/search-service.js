angular.module('seeDK')
  .service('searchService', ['$resource', '$http', function ($resource, $http) {
    var search = $resource('http://' + /* insert data store that has indexed and normalized data */ + '/_search?q=:query&from=:start&size=:len&pretty');
    return {
      advancedSearch : function (query, page, rpp, callback, error) {
        var start = page * rpp;
        var len = rpp;
        var data = this.parseQuery(query);
        $http({
          method: 'POST',
          url: 'http://' + /* insert data store that has indexed and normalized data */ + '/_search?'+'from='+start+'&size='+len+'&pretty',
          data: data
        }).then(function (response) {
          response.data.hits.hits.forEach(function (el) {
            el._source.uri_fragment = el._source.uri.replace(new RegExp('(http(s)?....*?\\/).*'), "$1");
          });
          callback && callback(response.data);
        }, function (problem) {
          error && error(problem);
        });
      },
      
      sanitizeQuery : function (query) {
        return encodeURI(query.replaceAll('\\s+', ' '))
            .replaceAll('!', '%21')
            .replaceAll('#', '%23');
      },
      
      parseQuery : function (query) {
        
        // grab tags
        var tags = (query.match(new RegExp('(?:^|\\W)tag:([^\\s]+)', 'g')) || []).map(function (el) { return el.replace(new RegExp('.*tag:'), ''); });
        var newQuery = query.replace(new RegExp('(?:^|\\W)tag:([^\\s]+)\\s?', 'g'), '');
        
        // grab index
        var index = (query.match(new RegExp('(?:^|\\W)index:([^\\s]+)', 'g')) || []).map(function (el) { return el.replace(new RegExp('.*index:'), ''); });
        newQuery = newQuery.replace(new RegExp('(?:^|\\W)index:([^\\s]+)\\s?', 'g'), '');
        
        var sanitizedQuery = this.sanitizeQuery(newQuery);
        var data = {
          query: {
            bool: {
              must: []
            }
          }
        };
        
        if (sanitizedQuery !== '') {
          data.query.bool.must.push({
            match: {
              'name': decodeURI(this.sanitizeQuery(newQuery))
            }
          });
        }
        
        tags.forEach(function (el) {
          data.query.bool.must.push({
            term: {
              'tags' : el
            }
          });
        });
        
        index.forEach(function (el) {
          data.query.bool.must.push({
            term: {
              '_index' : el
            }
          });
        });

        return data;
      }
    };
  }]);