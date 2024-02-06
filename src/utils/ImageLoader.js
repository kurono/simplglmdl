define(["require", "exports", "src/utils/AssetsPool"], function(require, exports, AssetsPool) {
        var ImageLoader = (function() {
            function ImageLoader() {
                this.content = null;
            }

            var _mainCallback;

            function onLoadComplete(image) {
                if (_mainCallback !== undefined) {
                    _mainCallback(image);
                }
            }

            ImageLoader.prototype.load = function(src, callbackFunction) {
                _mainCallback = callbackFunction;

                // try to get preloaded asset from the pool
                var asset = AssetsPool.get(src);

                if (asset !== undefined) {
                    // return already loaded asset
                    return  asset;
                } else {
                    // load an image and store to assets pool
                    var image = new Image();
                    image.addEventListener("load", function () {
                        AssetsPool.add(src, this);

                        // run after-load function
                        onLoadComplete(this);
                    }, false);
                    image.src = src;
                }
            };

            return ImageLoader;
        })();

    return ImageLoader;
});
