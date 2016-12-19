angular.module('chirp')
  .factory('Assets', function($firebaseArray){
    var assetRef = firebase.database().ref('devices');

    return {
      forAsset: function(uid) {
        return $firebaseArray(assetRef.child(uid));
      }
    };
  });
