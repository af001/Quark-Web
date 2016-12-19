angular.module('chirp')
  .controller('ProfileCtrl', function($mdToast, $state, $scope, md5, auth, profile, $mdSidenav, $mdDialog, $firebase){
    var profileCtrl = this;

    profileCtrl.profile = profile;

    profileCtrl.updateProfile = function(){
      profileCtrl.profile.emailHash = md5.createHash(auth.email);
      profileCtrl.profile.$save().then(function(){
        var toast = $mdToast.simple().content('Profile updated!').position('bottom left');
        $mdToast.show(toast);
        $state.go('map');
      });
    };

    $scope.showMobileMainHeader = true;

    $scope.openSideNavPanel = function() {
      $mdSidenav('left').open();
    };

    $scope.closeSideNavPanel = function() {
      $mdSidenav('left').close();
    };

    $scope.goMap = function() {
      $state.go('map');
    };

    $scope.events = function() {
      $state.go('events');
    };

    $scope.assets = function() {
      $state.go('assets');
    };

    $scope.logout = function() {
      firebase.auth().signOut().then(function() {
        $state.go('home');
        console.log('Signed out');
      }).catch(function(error) {
        console.log('Error signing out:', error);
      });
    };
  });
