angular.module('quark')
  .factory('Auth', function($firebaseAuth){
    var auth = $firebaseAuth();

    return auth;
  });
