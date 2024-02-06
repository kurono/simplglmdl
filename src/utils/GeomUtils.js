define(["require", "exports", "src/geom/Vector4"], function(require, exports, Vector4){
    var GeomUtils = (function(){
        function GeomUtils() {

        }

        // static fn
        // range should be an Object, {min: -lowValue, max: highValue}
        GeomUtils.randomVector = function(range) {
            // space * (1 - 2 * Math.random())
            var min = range["min"];
            var max = range["max"];
            var rand = function (min, max) { return min + (max - min) * Math.random(); };
            return new Vector4(rand(min, max), rand(min, max), rand(min, max));
        };

        return GeomUtils;
    })();

    return GeomUtils;
});
