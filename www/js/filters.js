angular.module('starter.filters',[]).filter('proximityIcon', function () {
    return function (proximity) {
        switch (proximity) {
            case "ProximityFar":
                return "assertive";
            case "ProximityNear":
                return "energized";
            case "ProximityImmediate":
                return "balanced";
            default:
                return "dark";
        }
    }

}).filter('proximityText', function () {
    return function (proximity) {
        switch (proximity) {
            case "ProximityFar":
                return "Far";
            case "ProximityNear":
                return "Near";
            case "ProximityImmediate":
                return "Immediate";
            default:
                return "Unknown";
        }
    }
}).filter('lastSeen', function () {
    return function (timestamp) {
        var now = new Date();
        if((now - timestamp)/1000 < 2){
            return "Currently in Range";
        } else {
            return ((now - timestamp)/1000).round(0) + " seconds ago";
        }
    }
});