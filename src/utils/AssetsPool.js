define(["require", "exports"], function(reqire, exports) {
    var AssetsPool = (function(){
        function AssetsPool(){

        };

        AssetsPool.assets = {};

        AssetsPool.add = function(src, data) {
            AssetsPool.assets[src] = data;
        };

        AssetsPool.get = function (src) {
            return AssetsPool.assets[src];
        };

        return AssetsPool;
    })();

    return AssetsPool;
});
