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
