angular.module('quark')
  .controller('AuthCtrl', function(Auth, $state){
    var authCtrl = this;

    authCtrl.reg = function() {
      $state.go('register');
    };

    authCtrl.log = function() {
      $state.go('login');
    };

    authCtrl.user = {
      email: '',
      password: ''
    };

    authCtrl.login = function (){
      Auth.$signInWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (auth){
        $state.go('home');
      }, function (error){
        authCtrl.error = error;
      });
    };

    authCtrl.register = function (){
      Auth.$createUserWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password).then(function (user){
        $state.go('home');
      }, function (error){
        authCtrl.error = error;
      });
    };
  });
