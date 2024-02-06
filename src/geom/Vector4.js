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

define(["require", "exports"], function(require, exports) {
    var Vector4 = (function () {
        function Vector4(x, y, z, w) {
            if (typeof x === "undefined") {
                x = 0;
            } // default values
            if (typeof y === "undefined") {
                y = 0;
            }
            if (typeof z === "undefined") {
                z = 0;
            }
            if (typeof w === "undefined") {
                w = 0;
            }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        Object.defineProperty(Vector4.prototype, "lengthSquared", {
            get: function () {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector4.prototype, "length", {
            get: function() {
                return Math.sqrt(this.lengthSquared);
            },
            enumerable: true,
            configurable: true
        });

        return Vector4;
    })();

    
    return Vector4;
});
