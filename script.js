var app = angular.module("app", []);

app.controller("MovieCtrl", function(StarWars, $scope) {

	$scope.characters = StarWars.getCharacters();
	$scope.movies = [];
  $scope.showMovies = true;
	
	$scope.getMovies = function(url) {
    var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	  StarWars.getMovies(url).then(function(movies){
      if (movies.error) {
        $scope.showMovies = false;
      } else {
        $scope.showMovies = true;
        $scope.movies = [];
        for (var i=0; i<movies.length; i++) {
          var d = new Date(movies[i].release_date);
          var dateString = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear();
          $scope.movies.push({
            title : movies[i].title,
            releaseDate : dateString
          });
        }
      }
    });
	};
});

angular.module('app').factory('StarWars', function($http, $q) {
  
    var characters = {
      "characters": [{
        "name": "Luke Skywalker",
        "url": "https://swapi.co/api/people/1/"
      }, {
        "name": "Darth Vader",
        "url": "https://swapi.co/api/people/4/"
      }, {
        "name": "Obi-wan Kenobi",
        "url": "https://swapi.co/api/people/unknown/"
      }, {
        "name": "R2-D2",
        "url": "https://swapi.co/api/people/2/"
      }]
    };
  
    return {
        getCharacters: function() {
          return characters.characters;
        },
        
        getMovies: function(url) {
          var deferred = $q.defer();
          $http.get(url).
            success(function(res){
              var reqs = [];
              for (var i=0; i<res.films.length; i++) {
                reqs.push($http.get(res.films[i]));
              }
              $q.all(reqs).then(function(response){
                var movies = [];
                for (var i=0; i<response.length; i++) {
                  movies.push(response[i].data);
                }
                deferred.resolve(movies);
              });
            })
            .error(function (data, status) {
              deferred.resolve({
                error: status
              })
            });
          return deferred.promise;
        }
    };
});