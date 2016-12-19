angular.module('quark')
  .factory('Events', function($firebaseArray){
    var eventRef = firebase.database().ref('events');

    return {
      forEvent: function(uid) {
        return $firebaseArray(eventRef.child(uid).limitToLast(500));
      }
    };
  });
