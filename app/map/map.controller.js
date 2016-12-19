angular.module("chirp")
  .config(function(uiGmapGoogleMapApiProvider) {

      uiGmapGoogleMapApiProvider.configure({
          key: 'AIzaSyCYuXEgBX9HnAp4BQB7rN5YvgWZ5zmQszo',
          v: '3.26', //defaults to latest 3.X anyhow
          libraries: 'weather,geometry,visualization'
      });
  })
  .controller("MapCtrl", (function($timeout, $scope, uiGmapGoogleMapApi, $mdSidenav, $state, $firebase, location) {
    var mapCtrl = this;

    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4};

    mapCtrl.location = location;
    $scope.markers = setMarkers($scope, location);

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

      mapCtrl.location.$watch(function (){
        $scope.markers = setMarkers($scope, location);
      });
    });

    $scope.showMobileMainHeader = true;

    $scope.openSideNavPanel = function() {
      $mdSidenav('left').open();
    };
    $scope.closeSideNavPanel = function() {
      $mdSidenav('left').close();
    };

    $scope.assets = function() {
      $state.go('assets');
    };

    $scope.events = function() {
      $state.go('events');
    };

    $scope.profile = function() {
      $state.go('profile');
    };

    $scope.logout = function() {
      firebase.auth().signOut().then(function() {
        $state.go('home');
        console.log('Signed out');
      }).catch(function(error) {
        console.log('Error signing out:', error);
      });
    };
  }));

function setMarkers($scope, location) {
  $scope.location = location;

  var Markers = [];
  var counter = 1;

  angular.forEach($scope.location, function(loc) {
    Markers[counter] = {
      "id": counter,
      "coords": {
        "latitude": loc.latitude,
        "longitude": loc.longitude
      },
      "title": loc.assetName,
      "options": {labelClass:'marker_labels',labelAnchor:'14 40',labelContent: loc.assetName},
      "icon": 'images/album.svg'
    };
    counter++;
  })

  return Markers;
}
