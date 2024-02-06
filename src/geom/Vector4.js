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
