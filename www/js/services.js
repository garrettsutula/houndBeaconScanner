angular.module('starter.services',['LocalForageModule'])

.factory('scanningManagement',['$rootScope' , '$log', '$localForage', function($rootScope, $log, $localForage){

    var createBeaconRegion = function (identifier, uuid) {
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
        $log.debug('Parsed BeaconRegion object:', JSON.stringify(beaconRegion, null, '\t'));
        return beaconRegion;
    }


    return {
        startRanging: function (identifier, uuid) {
            var beaconRegion = createBeaconRegion(identifier, uuid);
            $log.debug('startRanging()');
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail($log.error)
                .done();

            var delegate = new cordova.plugins.locationManager.Delegate();

            delegate.didRangeBeaconsInRegion = function (pluginResult) {
                $log.debug("didRangeBeaconsInRegion", JSON.stringify(pluginResult));
                pluginResult.id = new Date().getTime();
                pluginResult.timestamp = new Date();
                $localForage.getItem('ranging_events')
                    .then(function (rangingEvents) {
                        var currentTime = new Date().getSeconds();
                        rangingEvents = pluginResult;
                        return rangingEvents;
                    }).then(function (rangingEvents) {
                        return $localForage.setItem('ranging_events', rangingEvents);
                    }).then(function () {
                        $rootScope.$broadcast('updated_ranging_events');
                    });
            };
            cordova.plugins.locationManager.setDelegate(delegate);
            return beaconRegion;
        },

        stopRanging: function (beaconRegion) {
            $log.debug('stopRanging()');
            cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
                .fail(console.error)
                .done();
            return null;
        }        
    };

}]);