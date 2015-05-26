angular.module('starter.controllers',['LocalForageModule', 'starter.services'])
    .controller('mainCtrl', ['$rootScope', '$scope', '$log', '$localForage', 'scanningManagement' , function ($rootScope, $scope, $log, $localForage, scanningManagement) {

        $scope.beaconList = [];
        $scope.hideWelcomeMessageValue = false;
        $scope.lastUpdate = new Date();

        var uuid = '00000000-0000-0000-0000-000000000000';
        var identifier = 'Beacon';


        $scope.updateRangingEvents = function () {
            $log.debug('updateRangingEvents()');

            $localForage.getItem('ranging_events').then(function (rangingEvents) {
                var beaconResult = rangingEvents.beacons;
                angular.forEach(beaconResult, function (v, k) {
                    $log.debug('checking beacon', JSON.stringify(v));
                    var newBeacon = v;
                    var beaconMatch = false;
                    angular.forEach($scope.beaconList, function (v, k) {
                        if ((v.major == newBeacon.major) && (v.minor == newBeacon.minor)) {
                            beaconMatch = true;
                            newBeacon.timestamp = new Date();
                            $scope.beaconList[k] = newBeacon;

                        }
                    });
                    if (beaconMatch == false) {
                        newBeacon.timestamp = new Date();
                        $scope.beaconList.push(newBeacon);
                    }
                });
                $scope.lastUpdate = new Date();
            });
        };

        $scope.hideWelcomeMessage = function () {
            $scope.hideWelcomeMessageValue = true;
        };

        $scope.clearBeaconList = function () {
            $scope.beaconList = [];
        };

        //
        // Init
        //
        $scope.startScanning = function () { $scope.beaconRegion = scanningManagement.startRanging(identifier, uuid); };
        $scope.stopScanning = function () { $scope.beaconRegion = scanningManagement.stopRanging($scope.beaconRegion); };
        
        $scope.startScanning();
        $scope.$on('updated_ranging_events', $scope.updateRangingEvents);
    }]);

