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

define(["require", "exports", "src/geom/Matrix4", "src/render/TextureMaterial"], function(require, exports, Matrix4, TextureMaterial) {
    var Mesh = (function () {
        function Mesh() {
            // v0,v1,v2, v0,v1,v2, ...
            this.indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
            // x,y,z, x,y,z, ...
            this.vertices = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0,  1.0,  1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0];
            // u,v, u,v, ...
            this.uvs = null;
            // nx,ny,nz, nx,ny,nz, ...
            this.normals = null;
            // r,g,b, r,g,b, ...
            this.colors = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0];

            this.material = new TextureMaterial();

            // gpu-related
            // buffers
            this.xyzBuffer = null;
            this.indexBuffer = null;
            this.uvBuffer = null;
            this.normalsBuffer = null;
            this.colorBuffer = null;

            this.name = "defaultMesh";
            this.transform = new Matrix4();
            this.rotations = new Matrix4();
            this.translations = new Matrix4();
        }

        Mesh.prototype.createGPUBuffers = function(gl) {
            // vertex _xyzBuffer
            this.xyzBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.xyzBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // indices
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

            // uvs
            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);

            // normals
            //this.normalsBuffer = gl.createBuffer();
            //gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

            // colors
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        };

        Mesh.prototype.createInstance = function() {
            var m = new Mesh();

            m.indices = this.indices;
            m.vertices = this.vertices;
            m.uvs = this.uvs;
            m.normals = this.normals;

            m.xyzBuffer = this.xyzBuffer;
            m.colorBuffer = this.colorBuffer;
            m.uvBuffer = this.uvBuffer;
            m.normalsBuffer = this.normalsBuffer;
            m.indexBuffer = this.indexBuffer;
            m.material = this.material;

            // this values can't be references, just clone them
            m.rotations = this.rotations.clone();
            m.translations = this.translations.clone();
            m.transform = this.transform.clone();

            return m;
        };
        return Mesh;
    })();

    
    return Mesh;
});
