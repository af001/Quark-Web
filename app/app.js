'use strict';

/**
 * @ngdoc overview
 * @name quark
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
    .module('quark', [
        'firebase',
        'ngMaterial',
        'ngAnimate',
        'ngAria',
        'ngMessages',
        'angular-md5',
        'ui.router',
        'uiGmapgoogle-maps',
        'monospaced.qrcode'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireSignIn().then(function(auth) {
                            $state.go('map');
                        }, function(error) {
                            $state.go('login');
                            return;
                        });
                    }
                }
            })
            .state('assets', {
                url: '/assets',
                controller: 'AssetCtrl as assetCtrl',
                templateUrl: 'assets/assets.html',
                resolve: {
                    assets: function($state, Auth, Assets) {
                        return Auth.$requireSignIn().then(function(auth) {
                            return Assets.forAsset(auth.uid).$loaded();
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                }
            })
            .state('events', {
                url: '/events',
                controller: 'EventCtrl as eventCtrl',
                templateUrl: 'events/events.html',
                resolve: {
                    events: function($stateParams, $state, Auth, Events) {
                        return Auth.$requireSignIn().then(function(auth) {
                            return Events.forEvent(auth.uid).$loaded();
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                }
            })
            .state('map', {
                url: '/map',
                controller: 'MapCtrl as mapCtrl',
                templateUrl: 'map/map.html',
                resolve: {
                    profile: function($state, Auth, Users) {
                        return Auth.$requireSignIn().then(function(auth) {
                            return Users.getProfile(auth.uid).$loaded().then(function(profile) {
                                if (profile.displayName) {
                                    return profile;
                                } else {
                                    $state.go('profile');
                                }
                            });
                        }, function(error) {
                            $state.go('login');
                        });
                    },
                    location: function($state, Auth, Locations) {
                        return Auth.$requireSignIn().then(function(auth) {
                            return Locations.forLocation(auth.uid).$loaded();
                        });
                    }
                }
            })
            .state('login', {
                url: '/login',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/login.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireSignIn().then(function(auth) {
                            $state.go('map');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('register', {
                url: '/register',
                controller: 'AuthCtrl as authCtrl',
                templateUrl: 'auth/register.html',
                resolve: {
                    requireNoAuth: function($state, Auth) {
                        return Auth.$requireSignIn().then(function(auth) {
                            $state.go('map');
                        }, function(error) {
                            return;
                        });
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                controller: 'ProfileCtrl as profileCtrl',
                templateUrl: 'users/profile.html',
                resolve: {
                    auth: function($state, Users, Auth) {
                        return Auth.$requireSignIn().catch(function() {
                            $state.go('login');
                        });
                    },
                    profile: function(Users, Auth) {
                        return Auth.$requireSignIn().then(function(auth) {
                            return Users.getProfile(auth.uid).$loaded();
                        });
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('grey');
    })
    .config(function() {
        // Replace this config with your Firebase's config.
        // Config for your Firebase can be found using the "Web Setup"
        // button on the top right of the Firebase Dashboard in the
        // "Authentication" section.

        var config = {
            apiKey: "<api_key>",
            authDomain: "<auth_domain",
            databaseURL: "<database_url>",
            storageBucket: "<storage_bucket>",
            messagingSenderId: "<messaging_sender_id>"
        };

        firebase.initializeApp(config);
    });
