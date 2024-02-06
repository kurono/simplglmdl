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

define(["require", "exports", "src/utils/ImageLoader"], function(require, exports, ImageLoader) {
    var TextureBase = (function () {
        function TextureBase() {
            // public var
            this.gpuTexture = null;
        }

        // private vars
        var _gl;
        var _mainCallback;

        TextureBase.prototype.uploadToGPU = function(gl, imagedata, callback, caller) {
            _gl = gl;
            _mainCallback = callback;

            // load an external png image via js and apply it as a texture webgl
            var il = new ImageLoader();
            il.load(imagedata, this.onLoadComplete);
        };

        TextureBase.prototype.onLoadComplete = function(image) {
            //console.log(image + " src=" + image.src);

            var gl = _gl;

            this.gpuTexture = gl.createTexture();
            this.gpuTexture.image = image;
            gl.bindTexture(gl.TEXTURE_2D, this.gpuTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.gpuTexture.image); // bind fs0
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

            _mainCallback(this);
        };

        return TextureBase;
    })();

    
    return TextureBase;
});
