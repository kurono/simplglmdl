/*Released under MIT License

Copyright (c) 2013 Ilya Tsivilskiy a.k.a. kurono

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
