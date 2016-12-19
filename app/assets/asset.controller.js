angular.module('quark')
    .controller('AssetCtrl', function($mdToast, $state, $scope, $mdSidenav, $mdDialog, assets, $firebaseArray, $firebase) {
        var assetCtrl = this;

        assetCtrl.assets = assets;

        assetCtrl.asset

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

        $scope.profile = function() {
            $state.go('profile');
        };

        $scope.logout = function() {
            firebase.auth().signOut().then(function() {
                $state.go('home');
                var toast = $mdToast.simple().content('Logout successful!').position('bottom left');
                $mdToast.show(toast);
            }).catch(function(error) {
              var toast = $mdToast.simple().content('Error logging out!').position('bottom left');
              $mdToast.show(toast);
            });
        };

        $scope.showAdvanced = function(ev, qr) {
            $mdDialog.show({
                controller: DialogController,
                template: '<style>' +
                    '  body {' +
                    '     margin: 16px;' +
                    '     text-align: center;' +
                    '     height: auto;' +
                    '   }' +
                    '  .qrcode {' +
                    '     display: block; ' +
                    '     margin: 24px auto 16px;' +
                    '     max-width: 100%;' +
                    '  }' +
                    '</style>' +
                    '<body>' +
                    '  <h2>' + qr + '</h2>' +
                    '  <qrcode version="5" error-correction-level="M" size="200" data=' + qr + '></qrcode>' +
                    '</body>',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };

        var remove = function(asset) {
            assetCtrl.assets.$remove(asset);

            var user = firebase.auth().currentUser.uid;
            var locRef = firebase.database().ref('location/' + user + '/devices');
            var evRef = firebase.database().ref('events/' + user);

            locRef.child(asset.assetName).remove(function(error) {
                if (error) {
                  var toast = $mdToast.simple().content('Error removing asset!').position('bottom left');
                  $mdToast.show(toast);
                } else {
                  var toast = $mdToast.simple().content('Asset successfully removed!').position('bottom left');
                  $mdToast.show(toast);
                }
            });
        };

        $scope.addNewDevice = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'assets/new.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        };

        $scope.showConfirm = function(ev, asset) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Delete Asset')
                .textContent('Are you sure you want to delete this asset?')
                .ariaLabel('Delete')
                .targetEvent(ev)
                .ok('Do it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                remove(asset);
            });
        };

        var create_qrcode = function(text, typeNumber, errorCorrectionLevel, table) {

            var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
            qr.addData(text);
            qr.make();

            return qr.createImgTag();
        };

        function DialogController($scope, $mdDialog) {

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }
    });
