angular.module('quark')
  .factory('Locations', function($firebaseArray){
    var locationRef = firebase.database().ref('location');

    return {
      forLocation: function(uid) {
        return $firebaseArray(locationRef.child(uid + '/devices'));
      }
    };
  });
