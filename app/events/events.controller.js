angular.module("quark")
.config(function(uiGmapGoogleMapApiProvider) {

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCYuXEgBX9HnAp4BQB7rN5YvgWZ5zmQszo',
        v: '3.26', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})
.controller("EventCtrl", (function($timeout, $scope, uiGmapGoogleMapApi, $mdSidenav, $state, $firebase, events) {
  var eventCtrl = this;

  $scope.map = { center: { latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };

  eventCtrl.events = events;
  $scope.markers = setMarkers($scope, events);

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.
  uiGmapGoogleMapApi.then(function(maps) {

    eventCtrl.events.$watch(function (){
      $scope.markers = setMarkers($scope, events);
    });
  });

  $scope.showMobileMainHeader = true;

  $scope.openSideNavPanel = function() {
    $mdSidenav('left').open();
  };
  $scope.closeSideNavPanel = function() {
    $mdSidenav('left').close();
  };

  $scope.filter = function(input) {
    var Filter = [];
    var counter = 1;

    angular.forEach(eventCtrl.events, function(loc) {
      if (loc.assetName == input.toUpperCase()) {
        Filter[counter] = {
          "id": counter,
          "coords": {
            "latitude": loc.latitude,
            "longitude": loc.longitude
          },
          "title": loc.assetName,
          "date": loc.time,
          "emergency": false,
          "options": {labelClass:'marker_labels',labelAnchor:'14 40',labelContent: loc.assetName},
          "icon": 'images/album.svg'
        };
        counter++;
      }
    });
    if (Filter.length < 1) {
      eventCtrl.events = events;
      $scope.markers = setMarkers($scope, events);
    } else {
      $scope.markers = Filter;
    }
  };

  $scope.assets = function() {
    $state.go('assets');
  };

  $scope.goMap = function() {
    $state.go('map');
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

function setMarkers($scope, events) {
  $scope.events = events;

  var Events = [];
  var counter = 1;

  angular.forEach($scope.events, function(loc) {
    Events[counter] = {
      "id": counter,
      "coords": {
        "latitude": loc.latitude,
        "longitude": loc.longitude
      },
      "title": loc.assetName,
      "date": loc.time,
      "emergency": false,
      "options": {labelClass:'marker_labels',labelAnchor:'14 40',labelContent: loc.assetName},
      "icon": 'images/album.svg'
    };
    counter++;
  })

  return Events;
}
