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

define(["require", "exports", "src/geom/Matrix4"], function(require, exports, Matrix4) {
    var Renderer = (function () {
        function Renderer(view) {
            this.gl = null;
            this.view = view;
            this.meshes = [];

            this._currentShaderProgram = null;
            this._xyzVertexAttribute = null;
            this._colorVertexAttribute = null;
            this._uvVertexAttribute = null;
            //this._normalVertexAttribute = null;
            this._projMatrixUniform = null;
            this._viewMatrixUniform = null;
            this._worldMatrixUniform = null;
            this._textureSampler0Uniform = null;

            this._viewMx = null;
            //this._worldMx = null;
            this._projMx = null;

            this._initMatrices();
        }
        Renderer.prototype.createContext = function () {
            var gl = null;

            // depth and stencil should be True for mobile devices
            var attrs = {
                alpha: false,
                depth: true,
                stencil: true,
                antialias: true,
                premultipliedAlpha: true,
                preserveDrawingBuffer: false
            };

            try {
                gl = this.view.canvas.getContext("webgl", attrs) || this.view.canvas.getContext("experimental-webgl", attrs);
                if (gl === null) {
                    if (this.view.canvas.getContext("webgl") != null) {
                        alert("improper webgl context attributes!");
                    } else {
                        alert("error creatin webgl context");
                    }
                }
            } catch(e) {
                alert(e);
            }

            this.gl = gl;
        };

        Renderer.prototype.setViewport = function () {
            this.gl.viewport(0, 0, this.view.canvas.width, this.view.canvas.height);
        };

        Renderer.prototype.clear = function () {
            this.gl.clearColor(0.9, 0.9, 0.9, 1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        };

        Renderer.prototype._createShader = function (src, type) {
            var shader = this.gl.createShader(type);

            this.gl.shaderSource(shader, src);
            this.gl.compileShader(shader);

            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                alert(this.gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;
        };

        Renderer.prototype.compileShaders = function () {
            var vs_code =
                "    attribute vec3 vertexXYZ;				\n" +
                "    attribute vec3 vertexRGB;				\n" +
                "    attribute vec2 vertexUV;				\n" +
                "	 //attribute vec3 vertexNormal;			\n" +
                "    uniform mat4 worldMx;					\n" +
                "    uniform mat4 viewMx;					\n" +
                "    uniform mat4 projMx;					\n" +
                "    varying vec4 varRGB;					\n" +
                "    varying vec2 varUV;					\n" +
                "	 void main(void) {						\n" +
                "	 	 vec4 transfVertex = worldMx * vec4(vertexXYZ, 1.0);	\n" +
                "        gl_Position = projMx * viewMx * transfVertex; 			\n" +
                "        varRGB = vec4(vertexRGB, 1.0);		\n" +
                "        varUV = vertexUV;					\n" +
                "    }										\n";

            var fs_code =
                "    precision mediump float;				\n" +
                "	 uniform sampler2D fs0;					\n" +
                "    varying vec4 varRGB;					\n" +
                "    varying vec2 varUV;					\n" +
                "    void main(void) {						\n" +
                "		vec4 i = texture2D(fs0, varUV);		\n" +
                " 		i.xyz = vec3(i.xyz / i.www);		\n" + // color = color / alpha
                "		float ft1 = float(i.w - .5);		\n" + // A = alpha - alphaThreshold (.5)
                "		if (ft1 < 0.0) discard;				\n" + // if A < 0, don't render
                "    	gl_FragColor = i;					\n" +
                "}											\n";

            var vs = this._createShader(vs_code, this.gl.VERTEX_SHADER);
            var fs = this._createShader(fs_code, this.gl.FRAGMENT_SHADER);

            // link program
            this._currentShaderProgram = this.gl.createProgram();
            this.gl.attachShader(this._currentShaderProgram, vs);
            this.gl.attachShader(this._currentShaderProgram, fs);
            this.gl.linkProgram(this._currentShaderProgram);

            // attributes
            this._xyzVertexAttribute = this.gl.getAttribLocation(this._currentShaderProgram, "vertexXYZ");
            this.gl.enableVertexAttribArray(this._xyzVertexAttribute);
            this._colorVertexAttribute = this.gl.getAttribLocation(this._currentShaderProgram, "vertexRGB");
            this.gl.enableVertexAttribArray(this._colorVertexAttribute);
            this._uvVertexAttribute = this.gl.getAttribLocation(this._currentShaderProgram, "vertexUV");
            this.gl.enableVertexAttribArray(this._uvVertexAttribute);
            //this._normalVertexAttribute = this.gl.getAttribLocation(this._currentShaderProgram, "vertexNormal");
            //this.gl.enableVertexAttribArray(this._normalVertexAttribute);

            // uniforms
            this._projMatrixUniform = this.gl.getUniformLocation(this._currentShaderProgram, "projMx");
            this._viewMatrixUniform = this.gl.getUniformLocation(this._currentShaderProgram, "viewMx");
            this._worldMatrixUniform = this.gl.getUniformLocation(this._currentShaderProgram, "worldMx");
            this._textureSampler0Uniform = this.gl.getUniformLocation(this._currentShaderProgram, "fs0");

            if (!this.gl.getProgramParameter(this._currentShaderProgram, this.gl.LINK_STATUS)) {
                alert("initShaders:: failed!");
            }
        };

        Renderer.prototype._initMatrices = function () {
            this._viewMx = new Matrix4();

            //this._worldMx = new Matrix4();

            this._projMx = this.projMatrix(45, this.view.canvas.width / this.view.canvas.height, 1, 10000);
        };

        Renderer.prototype.projMatrix = function(fov, aspect, zNear, zFar) {
            var sy = 1.0 / Math.tan(fov * Math.PI / 360.0);
            var sx = sy / aspect;

            var mx = new Matrix4();
            mx.rawData[0] = sx;
            mx.rawData[1] = 0.0;
            mx.rawData[2] = 0.0;
            mx.rawData[3] = 0.0;

            mx.rawData[4] = 0.0;
            mx.rawData[5] = sy;
            mx.rawData[6] = 0.0;
            mx.rawData[7] = 0.0;

            mx.rawData[8] = 0.0;
            mx.rawData[9] = 0.0;
            mx.rawData[10] = zFar / (zNear - zFar);
            mx.rawData[11] = -1.0;

            mx.rawData[12] = 0.0;
            mx.rawData[13] = 0.0;
            mx.rawData[14] = (zNear * zFar) / (zNear - zFar);
            mx.rawData[15] = 0.0;

            return mx;
        };

        Renderer.prototype.render = function() {
            this.clear();

            if (this._currentShaderProgram == null) return;

            this.gl.useProgram(this._currentShaderProgram);

            // transform matrices
            this.gl.uniformMatrix4fv(this._projMatrixUniform, false, this._projMx.rawData);
            this.gl.uniformMatrix4fv(this._viewMatrixUniform, false, this._viewMx.rawData);

            for (var i=0; i < this.meshes.length; i++) {
                // vertex position
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshes[i].xyzBuffer);
                this.gl.vertexAttribPointer(this._xyzVertexAttribute, 3, this.gl.FLOAT, false, 0, 0);
                // uv
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshes[i].uvBuffer);
                this.gl.vertexAttribPointer(this._uvVertexAttribute, 2, this.gl.FLOAT, false, 0, 0);
                // normals
                //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshes[i].normalsBuffer);
                //this.gl.vertexAttribPointer(this._normalVertexAttribute, 3, this.gl.FLOAT, false, 0, 0);
                // colors
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.meshes[i].colorBuffer);
                this.gl.vertexAttribPointer(this._colorVertexAttribute, 3, this.gl.FLOAT, false, 0, 0);
                // indices
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.meshes[i].indexBuffer);

                // transform matrices
                this.gl.uniformMatrix4fv(this._worldMatrixUniform, false, this.meshes[i].transform.rawData);
                //this.gl.uniformMatrix4fv(_worldRotMatrixUniform, false, toFloat32(this.meshes[i].rotations.rawData));

                // texture sampler 0
                if (this.meshes[i].material.diffuse.isReady == false) return;
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.meshes[i].material.diffuse.gpuTexture);
                this.gl.uniform1i(this._textureSampler0Uniform, 0);

                /*// alpha blending
                 this.gl.enable(this.gl.BLEND);
                 this.gl.blendFunc(this.gl.ONE, this.gl.ZERO);
                 //this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
                 this.gl.blendEquation(this.gl.FUNC_ADD);
                 // enable culling
                 if (this.meshes[i].material.doubleSided == true) {
                 this.gl.disable(this.gl.CULL_FACE);
                 } else {
                 this.gl.enable(this.gl.CULL_FACE);
                 this.gl.cullFace(this.gl.BACK);
                 */

                if (this.meshes[i].material.doubleSided == true) {
                    this.gl.disable(this.gl.CULL_FACE);
                } else {
                    this.gl.enable(this.gl.CULL_FACE);
                    this.gl.cullFace(this.gl.BACK);
                }

                this.gl.drawElements(this.gl.TRIANGLES, this.meshes[i].indices.length, this.gl.UNSIGNED_SHORT, 0);
                //this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                this.gl.flush();
            }
        };

        return Renderer;
    })();

    
    return Renderer;
});
